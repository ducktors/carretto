import { expect, test } from 'vitest';

import { Key } from '../lib/key';
import { updateKeySkip } from '../lib/update-key-skip';

test('should return 0 when previous and current have no skip', () => {
  const previous: Key<any> = { query: { name: 'query1' }, projection: { firstName: 1 } };
  const current: Key<any> = { query: { name: 'query2' }, projection: { lastName: 1 } };

  expect(updateKeySkip(previous, current)).toBe(0);
});

test('should return 0 when current has no skip property', () => {
  const previous: Key<any> = {
    query: { name: 'query1' },
    projection: { firstName: 1 },
    skip: 10,
    limit: 10,
  };
  const current: Key<any> = { query: { name: 'query2' }, projection: { lastName: 1 } };

  expect(updateKeySkip(previous, current)).toBe(0);
});

test('should return 0 when previous has no skip property', () => {
  const previous: Key<any> = { query: { name: 'query1' }, projection: { firstName: 1 } };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 10,
    limit: 11,
  };

  expect(updateKeySkip(previous, current)).toBe(0);
});

test('should return 0 if previous has skip=0', () => {
  const previous: Key<any> = { query: { name: 'query1' }, projection: { firstName: 1 }, skip: 0 };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 10,
    limit: 11,
  };

  expect(updateKeySkip(previous, current)).toBe(0);
});

test('should return 0 if current has skip=0', () => {
  const previous: Key<any> = {
    query: { name: 'query1' },
    projection: { firstName: 1 },
    skip: 110,
    limit: 10,
  };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 0,
    limit: -1,
  };

  expect(updateKeySkip(previous, current)).toBe(0);
});

test('should return min of the skips if both are not empty and not 0', () => {
  const previous: Key<any> = {
    query: { name: 'query1' },
    projection: { firstName: 1 },
    skip: 10,
    limit: 10,
  };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 15,
    limit: 15,
  };

  expect(updateKeySkip(previous, current)).toBe(10);
});
