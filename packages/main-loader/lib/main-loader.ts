import DataLoader, { BatchLoadFn } from "dataloader";

import { hash } from "./hash";
import type { Key } from "./key";
import { createQueriesMapFactory } from './create-queries-map-factory'
import { MergeProjectionFn } from "./merge-projection-fn";

export abstract class MainLoader<T, Q extends object, P> {
	protected loader: DataLoader<Key<Q, P>, T>;

	constructor() {
		this.loader = new DataLoader<Key<Q, P>, T, string>(
			this.batchLoadFn.bind(this) as BatchLoadFn<Key<Q, P>, T>,
			{
				cacheKeyFn: this.cacheKeyFn,
			},
		);
	}

	public load(key: Key<Q, P>) {
		return this.loader.load(key);
	}

	protected async batchLoadFn(keys: readonly Key<Q, P>[]) {
		const promises: Promise<T[] | T | null>[] = [];
		const indexedPromises = new Map<string, number>();

		for (const [hashKey, key] of createQueriesMapFactory(this.mergeProjection)(keys)) {
			indexedPromises.set(hashKey, promises.length);
			promises.push(this.execute(key as Key<Q, P>));
		}

		const resultSet = await Promise.all(promises);
		return keys.map((key) => {
			return resultSet[indexedPromises.get(hash(key.query))!];
		});
	}

	protected cacheKeyFn(key: Key<Q, P>) {
		return hash(key);
	}

	protected abstract execute(key: Key<Q, P>): Promise<T | T[] | null>;
	protected abstract mergeProjection: MergeProjectionFn<P, P>;
}
