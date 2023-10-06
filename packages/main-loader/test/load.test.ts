import { test } from 'node:test';

import assert from 'assert';
import { TestLoader } from './util/test-loader';

test('should aggregate same queries projections', async (t) => {
  const spy = t.mock.fn();
  const loader = new TestLoader(spy);

  await Promise.all([
    loader.load({
      query: { test: 'test' },
      projection: { firstName: 1 },
    }),
    loader.load({
      query: { test: 'test' },
      projection: { lastName: 1 },
    }),
  ]);

  assert.strictEqual(spy.mock.callCount(), 1);
  assert.deepStrictEqual(spy.mock.calls[0].arguments, [
    {
      query: { test: 'test' },
      projection: { firstName: 1, lastName: 1 },
    },
  ]);
});
