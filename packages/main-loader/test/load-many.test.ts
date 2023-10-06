import assert from 'node:assert';
import { test } from 'node:test';
import { TestLoader } from './util/test-loader';

test('should use default skip and limit', async (t) => {
  const spy = t.mock.fn();
  const loader = new TestLoader(spy);

  await Promise.all([
    loader.loadMany({
      query: { test: 'test' },
      projection: { friends: 1 },
    }),
    loader.loadMany({
      query: { test: 'test' },
      projection: { otherFriends: 1 },
    }),
  ]);

  assert.strictEqual(spy.mock.callCount(), 1);
  assert.deepStrictEqual(spy.mock.calls[0].arguments, [
    {
      query: { test: 'test' },
      projection: { friends: 1, otherFriends: 1 },
      skip: 0,
      limit: 0,
    },
  ]);
});

test('should aggregate same queries projections and skip and limit', async (t) => {
  const spy = t.mock.fn();
  const loader = new TestLoader(spy);

  await Promise.all([
    loader.loadMany({
      query: { test: 'test' },
      projection: { friends: 1 },
      skip: 0,
      limit: 10,
    }),
    loader.loadMany({
      query: { test: 'test' },
      projection: { otherFriends: 1 },
      skip: 5,
      limit: 15,
    }),
  ]);

  assert.strictEqual(spy.mock.callCount(), 1);
  assert.deepStrictEqual(spy.mock.calls[0].arguments, [
    {
      query: { test: 'test' },
      projection: { friends: 1, otherFriends: 1 },
      skip: 0,
      limit: 15,
    },
  ]);
});
