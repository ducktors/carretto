import assert from 'node:assert';
import { test } from 'node:test';
import { TestLoader } from './util/test-loader-preload';

test('should change the key in the pre load hook', async (t) => {
  const spy = t.mock.fn();
  const loader = new TestLoader(spy);

  await loader.load({
    query: { test: 'test' },
    projection: { firstName: 1 },
  });

  assert.deepStrictEqual(spy.mock.calls[0].arguments, [
    {
      query: { test: 'test', added: 'added' },
      projection: { firstName: 1 },
    },
  ]);
});
