import { describe, expect, it } from 'vitest';

import { extractTags } from './extract-tags';

describe('extractTags', () => {
  it('extracts explicit hashtags from content', () => {
    expect(extractTags('I love #JavaScript')).toEqual(['javascript']);
  });

  it('extracts multiple explicit hashtags', () => {
    expect(extractTags('#react and #graphql are great')).toEqual(['react', 'graphql']);
  });

  it('extracts hashtags with trailing punctuation', () => {
    expect(extractTags('Check out #ReactJS. It is cool')).toEqual(['reactjs']);
  });

  it('extracts hashtags with numbers', () => {
    expect(extractTags('Upgrade to #angular2')).toEqual(['angular2']);
  });

  it('extracts implicit proper nouns from content', () => {
    const tags = extractTags('Building an API with PostgreSQL and GraphQL');
    expect(tags).toContain('postgresql');
    expect(tags).toContain('graphql');
  });

  it('extracts implicit common nouns from content', () => {
    const tags = extractTags('The database schema needs an index on the email column');
    expect(tags).toContain('database');
    expect(tags).toContain('schema');
    expect(tags).toContain('email');
  });

  it('deduplicates when the same word appears as explicit and implicit', () => {
    const tags = extractTags('#GraphQL is great. I love GraphQL');
    expect(tags.filter((t) => t === 'graphql')).toHaveLength(1);
  });

  it('returns empty array for empty content', () => {
    expect(extractTags('')).toEqual([]);
  });

  it('returns empty array for whitespace-only content', () => {
    expect(extractTags('   ')).toEqual([]);
  });

  it('filters out stop words', () => {
    const tags = extractTags('This is a test of the system');
    expect(tags).not.toContain('this');
    expect(tags).not.toContain('is');
    expect(tags).not.toContain('a');
    expect(tags).not.toContain('of');
    expect(tags).not.toContain('the');
  });

  it('filters out single-character words', () => {
    const tags = extractTags('x y z');
    expect(tags.every((t) => t.length > 1)).toBe(true);
  });

  it('filters out purely numeric words', () => {
    const tags = extractTags('version 42 has 100 bugs in build 7');
    expect(tags).not.toContain('42');
    expect(tags).not.toContain('100');
    expect(tags).not.toContain('7');
  });

  it('limits to 15 tags', () => {
    const content =
      '#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10 ' +
      '#tag11 #tag12 #tag13 #tag14 #tag15 #tag16 #tag17 #tag18 #tag19 #tag20';
    const tags = extractTags(content);
    expect(tags.length).toBeLessThanOrEqual(15);
  });

  it('preserves words with dots like node.js', () => {
    const tags = extractTags('Building apps with Node.js');
    expect(tags).toContain('node.js');
  });

  it('handles content with no hashtags but has implicit nouns', () => {
    const tags = extractTags('it is a good thing');
    expect(tags.length).toBeGreaterThan(0);
    expect(tags).toContain('thing');
    expect(tags).not.toContain('it');
    expect(tags).not.toContain('a');
  });

  it('normalizes to lowercase', () => {
    const tags = extractTags('#ReaCT and #GraphQL');
    expect(tags).toContain('react');
    expect(tags).toContain('graphql');
  });
});
