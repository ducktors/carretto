import { expect, test } from 'vitest';

import { Key } from '../lib/key';
import { updateKeyLimit } from '../lib/update-key-limit';

test('should return 0 when previous and current have no limit', () => {
  const previous: Key<any> = { query: { name: 'query1' }, projection: { firstName: 1 } };
  const current: Key<any> = { query: { name: 'query2' }, projection: { lastName: 1 } };

  expect(updateKeyLimit(previous, current)).toBe(0);
});

test('should return 0 when current has no limit property', () => {
  const previous: Key<any> = {
    query: { name: 'query1' },
    projection: { firstName: 1 },
    skip: 0,
    limit: 10,
  };
  const current: Key<any> = { query: { name: 'query2' }, projection: { lastName: 1 } };

  expect(updateKeyLimit(previous, current)).toBe(0);
});

test('should return 0 when previous has no limit property', () => {
  const previous: Key<any> = { query: { name: 'query1' }, projection: { firstName: 1 }, skip: 0 };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 0,
    limit: 11,
  };

  expect(updateKeyLimit(previous, current)).toBe(0);
});

test('should return 0 if previous has limit=0', () => {
  const previous: Key<any> = {
    query: { name: 'query1' },
    projection: { firstName: 1 },
    skip: 0,
    limit: 0,
  };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 0,
    limit: 11,
  };

  expect(updateKeyLimit(previous, current)).toBe(0);
});

test('should return 0 if current has limit=0', () => {
  const previous: Key<any> = {
    query: { name: 'query1' },
    projection: { firstName: 1 },
    skip: 0,
    limit: 10,
  };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 0,
    limit: 0,
  };

  expect(updateKeyLimit(previous, current)).toBe(0);
});

test('should return max of the limits if both are not empty and not 0', () => {
  const previous: Key<any> = {
    query: { name: 'query1' },
    projection: { firstName: 1 },
    skip: 0,
    limit: 10,
  };
  const current: Key<any> = {
    query: { name: 'query2' },
    projection: { lastName: 1 },
    skip: 0,
    limit: 15,
  };

  expect(updateKeyLimit(previous, current)).toBe(15);
});
