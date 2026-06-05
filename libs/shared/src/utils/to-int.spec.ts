import { describe, expect, it } from 'vitest';

import { toInt } from './to-int';

describe('toInt', () => {
  it('returns the number as-is when given a plain number', () => {
    expect(toInt(0)).toBe(0);
    expect(toInt(42)).toBe(42);
    expect(toInt(-1)).toBe(-1);
  });

  it('truncates floats to integers', () => {
    expect(toInt(3.14)).toBe(3.14);
  });

  it('handles NaN', () => {
    expect(toInt(NaN)).toBeNaN();
  });

  it('handles Infinity', () => {
    expect(toInt(Infinity)).toBe(Infinity);
    expect(toInt(-Infinity)).toBe(-Infinity);
  });

  it('calls toNumber() on an object that has it', () => {
    const obj = { toNumber: (): number => 99 };
    expect(toInt(obj)).toBe(99);
  });

  it('calls toNumber() on a Neo4j-like Integer', () => {
    const neo4jInt = { toNumber: (): number => 100 };
    expect(toInt(neo4jInt)).toBe(100);
  });

  it('passes through a negative result from toNumber()', () => {
    const obj = { toNumber: (): number => -5 };
    expect(toInt(obj)).toBe(-5);
  });

  it('passes through a float result from toNumber()', () => {
    const obj = { toNumber: (): number => 2.5 };
    expect(toInt(obj)).toBe(2.5);
  });

  it('passes through zero from toNumber()', () => {
    const obj = { toNumber: (): number => 0 };
    expect(toInt(obj)).toBe(0);
  });

  it('throws when given null', () => {
    expect(() => toInt(null)).toThrow();
  });

  it('throws when given undefined', () => {
    expect(() => toInt(undefined)).toThrow();
  });

  it('throws when given a string', () => {
    expect(() => toInt('42')).toThrow();
  });

  it('throws when given a boolean', () => {
    expect(() => toInt(true)).toThrow();
    expect(() => toInt(false)).toThrow();
  });

  it('throws when given an array', () => {
    expect(() => toInt([1, 2, 3])).toThrow();
  });

  it('throws when given a plain object without toNumber', () => {
    expect(() => toInt({})).toThrow();
  });

  it('throws when given a symbol', () => {
    expect(() => toInt(Symbol('x'))).toThrow();
  });
});
