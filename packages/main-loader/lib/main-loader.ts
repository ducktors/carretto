import DataLoader, { BatchLoadFn } from "dataloader";

import { hash } from "./hash";
import type { Key } from "./key";
import { createQueriesMap } from './create-queries-map'

export abstract class MainLoader<T> {
	protected loader: DataLoader<Key, T>;

	constructor() {
		this.loader = new DataLoader<Key, T, string>(
			this.batchLoadFn.bind(this) as BatchLoadFn<Key, T>,
			{
				cacheKeyFn: this.cacheKeyFn,
			},
		);
	}

	public load(key: Key) {
		return this.loader.load(key);
	}

	protected async batchLoadFn(keys: readonly Key[]) {
		const promises: Promise<T[] | T | null>[] = [];
		const indexedPromises = new Map<string, number>();

		for (const [hashKey, key] of createQueriesMap(keys)) {
			indexedPromises.set(hashKey, promises.length);
			promises.push(this.execute(key));
		}

		const resultSet = await Promise.all(promises);
		return keys.map((key) => {
			return resultSet[indexedPromises.get(hash(key.query))!];
		});
	}

	protected cacheKeyFn(key: Key) {
		return hash(key);
	}

	protected abstract execute(key: Key): Promise<T | T[] | null>;
}
