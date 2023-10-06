import assert from 'node:assert';
import { test } from 'node:test';

import { mergeProjections } from '../lib/merge-projections';

test('should return {} when projections are not provided', () => {
  assert.deepStrictEqual(mergeProjections(), {});
});

test('should return old when curr is not provided', () => {
  assert.deepStrictEqual(mergeProjections({ foo: 1 }), { foo: 1 });
});

test('should return curr when old is not provided', () => {
  assert.deepStrictEqual(mergeProjections(undefined, { foo: 1 }), { foo: 1 });
});

test('should merge old and curr', () => {
  assert.deepStrictEqual(mergeProjections({ bar: 1 }, { foo: 1 }), {
    bar: 1,
    foo: 1,
  });
});

test('should return higher-level key only when dot notation is provided, old nested', () => {
  assert.deepStrictEqual(mergeProjections({ 'foo.bar': 1 }, { foo: 1 }), {
    foo: 1,
  });
});

test('should return higher-level key only when dot notation is provided, curr nested', () => {
  assert.deepStrictEqual(mergeProjections({ foo: 1 }, { 'foo.bar': 1 }), {
    foo: 1,
  });
});

test('should return higher-level key only when dot notation is provided, both nested', () => {
  assert.deepStrictEqual(mergeProjections({ 'foo.nested': 1 }, { 'foo.bar': 1 }), {
    'foo.nested': 1,
    'foo.bar': 1,
  });
});
