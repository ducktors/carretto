import DataLoader, { BatchLoadFn } from "dataloader"

import { hash } from "./hash";
import type { Key } from "./key";
import { createQueriesMapFactory } from './create-queries-map-factory'

export abstract class MainLoader<T, Q extends object> {
	protected loader: DataLoader<Key<Q>, T>;

	constructor() {
		this.loader = new DataLoader<Key<Q>, T, string>(
			this.batchLoadFn.bind(this) as BatchLoadFn<Key<Q>, T>,
			{
				cacheKeyFn: this.cacheKeyFn,
			},
		);
	}

	public async load(key: Key<Q>): Promise<T | null> {
		this.onLoad(key)
		return this.loader.load(key)
	}

	public async loadMany(key: Key<Q>): Promise<T[]> {
		this.onLoad(key)
		return this.loader.load({ skip: 0, limit: -1, ...key }) as Promise<T[]>
	}

	protected async batchLoadFn(keys: readonly Key<Q>[]) {
		const promises: Promise<T[] | T | null>[] = [];
		const indexedPromises = new Map<string, number>();

		for (const [hashKey, key] of createQueriesMapFactory()(keys)) {
			indexedPromises.set(hashKey, promises.length);
			promises.push(this.execute(key as Key<Q>));
		}

		const resultSet = await Promise.all(promises);
		return keys.map((key) => {
			return resultSet[indexedPromises.get(hash(key.query))!];
		});
	}

	protected cacheKeyFn(key: Key<Q>) {
		return hash(key);
	}

	protected onLoad(key: Key<Q>) {}

	protected onError(error: Error, key: Key<Q>) {}

	protected abstract execute(key: Key<Q>, options?: unknown): Promise<T | T[] | null>;
}
