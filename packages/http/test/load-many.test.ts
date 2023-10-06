import assert from 'node:assert';
import { stringify } from 'node:querystring';
import { test } from 'node:test';
import Undici from 'undici';
import { DataloaderHttp } from '../lib';

const url = 'http://localhost:3000';

test('should aggregate same queries projections', async (t) => {
  t.mock.method(Undici, 'request', ((input: string) => {
    assert.strictEqual(
      input,
      `${url}/?${stringify({
        projection: ['firstName', 'lastName'],
      })}&skip=0&limit=15`,
    );
    return Promise.resolve({
      body: {
        json: () => [
          { firstName: 'Mario', lastName: 'Rossi' },
          { firstName: 'Luigi', lastName: 'Rossi' },
        ],
      },
    });
  }) as any);

  const loader = new DataloaderHttp();

  const results = await Promise.all([
    loader.loadMany({
      query: new URL(url),
      projection: { firstName: 1 },
      skip: 0,
      limit: 10,
    }),
    loader.loadMany({
      query: new URL(url),
      projection: { lastName: 1 },
      skip: 5,
      limit: 15,
    }),
  ]);

  assert.strictEqual(Undici.request.mock.calls.length, 1);
});
