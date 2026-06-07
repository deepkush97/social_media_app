export interface SeedUser {
  name: string;
  email: string;
  password: string;
  userId?: number;
  token?: string;
}

export interface SeedPost {
  title: string;
  content: string;
  tags: string[];
  postId?: number;
  userId?: number;
}

export interface SeedComment {
  content: string;
}

export function parseArgs(argv: string[]): Record<string, number> {
  const args: Record<string, number> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = argv[i + 1];
      if (val && !val.startsWith('--')) {
        args[key] = Number(val);
        i++;
      } else {
        args[key] = 1;
      }
    }
  }
  return args;
}

export function createRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function shuffleArray<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export class StatusTracker {
  private c2xx = 0;
  private c4xx = 0;
  private c5xx = 0;
  private other = 0;

  record(status: number): void {
    if (status >= 200 && status < 300) this.c2xx++;
    else if (status >= 400 && status < 500) this.c4xx++;
    else if (status >= 500 && status < 600) this.c5xx++;
    else this.other++;
  }

  count2xx(): number {
    return this.c2xx;
  }

  format(): string {
    const parts: string[] = [];
    if (this.c2xx) parts.push(`2xx=${this.c2xx}`);
    if (this.c4xx) parts.push(`4xx=${this.c4xx}`);
    if (this.c5xx) parts.push(`5xx=${this.c5xx}`);
    if (this.other) parts.push(`?=${this.other}`);
    return parts.join(' ');
  }
}

export class LatencyTracker {
  private durations: number[] = [];
  private label: string;

  constructor(label: string) {
    this.label = label;
  }

  record(durationMs: number): void {
    this.durations.push(durationMs);
  }

  snapshot(count: number, total: number): string {
    if (this.durations.length === 0) return `${this.label} ${count} / ${total}`;

    const sorted = this.durations.slice().sort((a, b) => a - b);
    const len = sorted.length;

    const p50 = sorted[Math.floor(len * 0.5)];
    const p95 = sorted[Math.floor(len * 0.95)];
    const p99 = sorted[Math.floor(len * 0.99)];

    const avg = sorted.reduce((s, v) => s + v, 0) / len;

    return `${this.label} ${count} / ${total}  p50=${p50}ms p95=${p95}ms p99=${p99}ms avg=${avg.toFixed(0)}ms`;
  }
}

export async function mapConcurrent<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency: number,
  onProgress?: (completed: number, total: number) => void,
): Promise<R[]> {
  const results: R[] = [];
  const queue = [...items.entries()];
  let completed = 0;
  const total = items.length;

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const entry = queue.shift();
      if (entry === undefined) return;
      const [index, item] = entry;
      results[index] = await fn(item, index);
      if (onProgress) {
        completed++;
        if (completed % 200 === 0 || completed === total) {
          onProgress(completed, total);
        }
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);

  return results;
}
