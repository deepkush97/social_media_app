#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

SERVICE_PORTS=()
while IFS= read -r port; do
  SERVICE_PORTS+=("$port")
done < <(grep -h '^APP_PORT=' .env.* 2>/dev/null | cut -d= -f2 | sort -n)

echo "=== Step 1: Kill pm2 services ==="
pm2 kill 2>/dev/null && echo "pm2 daemon stopped" || echo "pm2 was not running"

echo ""
echo "=== Step 2: Free service ports ==="
for port in "${SERVICE_PORTS[@]}"; do
  pid=$(lsof -ti :"$port" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo "  Port $port is in use by PID $pid — killing..."
    kill -9 "$pid" 2>/dev/null || true
  else
    echo "  Port $port is free"
  fi
done

echo ""
echo "=== Step 3: Remove stale infra containers ==="
CONTAINERS=$(podman compose ps -a --format '{{.Names}}' 2>/dev/null || true)
if [ -n "$CONTAINERS" ]; then
  echo "Project containers detected:"
  echo "$CONTAINERS" | sed 's/^/  /'
  echo "Removing containers and volumes..."
  podman compose down -v
  echo "Done"
else
  echo "No project containers found"
fi

echo ""
echo "=== Step 4: Start infra fresh ==="
podman compose up -d
echo "Infra containers starting..."

echo ""
echo "=== Step 5: Wait for infra health ==="
echo "Waiting for MySQL..."
until podman exec mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
  sleep 2
done
echo "  MySQL ready"

echo "Waiting for Redis..."
until podman exec redis redis-cli ping 2>/dev/null | grep -q PONG; do
  sleep 1
done
echo "  Redis ready"

echo "Waiting for Elasticsearch..."
until curl -s http://localhost:9200 >/dev/null 2>&1; do
  sleep 3
done
echo "  Elasticsearch ready"

echo "Waiting for Neo4j..."
until curl -s http://localhost:7474 >/dev/null 2>&1; do
  sleep 3
done
echo "  Neo4j ready"

echo "Waiting for NATS..."
until curl -s http://localhost:8222 >/dev/null 2>&1; do
  sleep 2
done
echo "  NATS ready"

echo ""
echo "=== Step 6: Start application services ==="
pm2 start ecosystem.config.js
echo "Services started — run 'pm2 logs' to follow"

echo ""
echo "=== Done ==="
