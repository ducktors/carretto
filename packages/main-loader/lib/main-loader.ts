import DataLoader, { BatchLoadFn } from 'dataloader';

import { hash } from './hash';
import type { Key } from './key';
import { createQueriesMapFactory } from './create-queries-map-factory';

export abstract class MainLoader<TReturn, TQuery extends object> {
  protected loader: DataLoader<Key<TQuery>, TReturn>;
  protected createQueriesMap;

  constructor() {
    this.loader = new DataLoader<Key<TQuery>, TReturn, string>(
      this.batchLoadFn.bind(this) as BatchLoadFn<Key<TQuery>, TReturn>,
      {
        cacheKeyFn: this.cacheKeyFn,
      },
    );
    this.createQueriesMap = createQueriesMapFactory()
  }

  public async load<U extends TReturn = TReturn>(key: Key<TQuery>): Promise<U | null> {
    this.onLoad(key);
    return this.loader.load(key) as Promise<U | null>;
  }

  public async loadMany<U extends TReturn = TReturn>(key: Key<TQuery>): Promise<U[]> {
    this.onLoad(key);
    const { skip, limit } = key
    return this.loader.load({ skip: skip ?? 0, limit: limit ?? 0, ...key }) as Promise<U[]>;
  }

  protected async batchLoadFn(keys: readonly Key<TQuery>[]) {
    const promises: Promise<TReturn[] | TReturn | null>[] = [];
    const indexedPromises = new Map<string, number>();

    for (const [hashKey, key] of this.createQueriesMap(keys)) {
      indexedPromises.set(hashKey, promises.length);
      promises.push(this.execute(key as Key<TQuery>));
    }

    const resultSet = await Promise.all(promises);
    return keys.map((key) => {
      return resultSet[indexedPromises.get(hash(key.query))!];
    });
  }

  protected cacheKeyFn(key: Key<TQuery>) {
    return hash(key);
  }

  protected onLoad(key: Key<TQuery>) {}

  protected onError(error: Error, key: Key<TQuery>) {}

  protected abstract execute(key: Key<TQuery>, options?: unknown): Promise<TReturn | TReturn[] | null>;
}
