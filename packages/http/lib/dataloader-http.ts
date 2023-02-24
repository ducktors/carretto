import { stringify } from 'node:querystring';
import { request } from 'undici';
import { MainLoader } from '@carretto/main-loader';
import { Projection } from '@carretto/projection';

import { Key } from './key';

export class DataloaderHttp<T> extends MainLoader<T, URL> {
  protected async execute(key: Pick<Key, 'query' | 'skip' | 'limit'> & { projection: Projection }) {
    const { body } = await request(
      `${key.query}?${stringify({ projection: Object.keys(key.projection) })}&skip=${
        key.skip ?? 0
      }&limit=${key.limit ?? 0}`,
      { method: 'GET' },
    );
    return body.json() as Promise<T | T[] | null>;
  }
}
