import { stringify } from 'node:querystring';
import { test } from 'node:test';
import Undici from 'undici';

import assert from 'node:assert';
import { DataloaderHttp } from '../lib';

const url = 'http://localhost:3000';

test('should aggregate same queries projections', async (t) => {
  t.mock.method(Undici, 'request', ((input: string) => {
    assert.strictEqual(
      input,
      `${url}/?${stringify({
        projection: ['firstName', 'lastName'],
      })}&skip=0&limit=0`,
    );
    return Promise.resolve({
      body: {
        json: () => ({ firstName: 'Mario', lastName: 'Rossi' }),
      },
    });
  }) as any);
  const loader = new DataloaderHttp();

  await Promise.all([
    loader.load<any>({
      query: new URL(url),
      projection: { firstName: 1 },
    }),
    loader.load<any>({
      query: new URL(url),
      projection: { lastName: 1 },
    }),
  ]);

  assert.strictEqual(Undici.request.mock.calls.length, 1);
});
