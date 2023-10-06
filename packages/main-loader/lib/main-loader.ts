import DataLoader, { BatchLoadFn } from 'dataloader';

import { createQueriesMapFactory } from './create-queries-map-factory';
import { hash } from './hash';
import type { Key } from './key';

const createQueriesMap = createQueriesMapFactory();

export abstract class MainLoader<
  TReturn,
  TQuery extends object,
  TLoadKey extends Pick<Key<TQuery>, 'query' | 'skip' | 'limit'> = Key<TQuery>,
> {
  protected loader: DataLoader<Key<TQuery>, TReturn>;

  constructor() {
    this.loader = new DataLoader<Key<TQuery>, TReturn, string>(
      this.batchLoadFn.bind(this) as BatchLoadFn<Key<TQuery>, TReturn>,
      {
        cacheKeyFn: this.cacheKeyFn,
      },
    );
  }

  public async load<U extends TReturn = TReturn>(key: TLoadKey): Promise<U | null> {
    const internalKey = this.preLoad(key);
    return this.loader.load(internalKey) as Promise<U | null>;
  }

  public async loadMany<U extends TReturn = TReturn>(key: TLoadKey): Promise<U[]> {
    const internalKey = this.preLoad(key);
    const { skip, limit } = key;
    return this.loader.load({
      skip: skip ?? 0,
      limit: limit ?? 0,
      ...internalKey,
    }) as Promise<U[]>;
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
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      return resultSet[indexedPromises.get(hash(key.query))!];
    });
  }

  protected cacheKeyFn(key: Key<TQuery>) {
    return hash(key);
  }

  private createQueriesMap(keys: readonly Key<TQuery>[]) {
    return createQueriesMap(keys);
  }

  protected preLoad(key: TLoadKey): Key<TQuery> {
    return key as unknown as Key<TQuery>;
  }

  protected onError(error: Error, key: Key<TQuery>) {}

  protected abstract execute(
    key: Key<TQuery>,
    options?: unknown,
  ): Promise<TReturn | TReturn[] | null>;
}
