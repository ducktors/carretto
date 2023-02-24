import DataLoader, { BatchLoadFn } from 'dataloader';

import { hash } from './hash';
import type { Key } from './key';
import { createQueriesMapFactory } from './create-queries-map-factory';
import { ProjectionKey } from './projection-key';
import { buildProjection } from '@carretto/projection';

export abstract class MainLoader<T, Q extends object> {
  protected loader: DataLoader<ProjectionKey<Q>, T>;
  protected createQueriesMap;

  constructor() {
    this.loader = new DataLoader<ProjectionKey<Q>, T, string>(
      this.batchLoadFn.bind(this) as BatchLoadFn<ProjectionKey<Q>, T>,
      {
        cacheKeyFn: this.cacheKeyFn,
      },
    );
    this.createQueriesMap = createQueriesMapFactory()
  }

  public async load<U extends T = T>(key: Key<Q>): Promise<U | null> {
    this.onLoad(key);
    return this.loader.load({ query: key.query, projection: buildProjection(key.info) }) as Promise<U | null>;
  }

  public async loadMany<U extends T = T>(key: Key<Q>): Promise<U[]> {
    this.onLoad(key);
    const { skip, limit, query, info } = key
    return this.loader.load({ skip: skip ?? 0, limit: limit ?? 0, query, projection: buildProjection(info) }) as Promise<U[]>;
  }

  protected async batchLoadFn(keys: readonly ProjectionKey<Q>[]) {
    const promises: Promise<T[] | T | null>[] = [];
    const indexedPromises = new Map<string, number>();

    for (const [hashKey, key] of this.createQueriesMap(keys)) {
      indexedPromises.set(hashKey, promises.length);
      promises.push(this.execute(key as ProjectionKey<Q>));
    }

    const resultSet = await Promise.all(promises);
    return keys.map((key) => {
      return resultSet[indexedPromises.get(hash(key.query))!];
    });
  }

  protected cacheKeyFn(key: ProjectionKey<Q>) {
    return hash(key);
  }

  protected onLoad(key: Key<Q>) {}

  protected onError(error: Error, key: Key<Q>) {}

  protected abstract execute(key: ProjectionKey<Q>, options?: unknown): Promise<T | T[] | null>;
}
