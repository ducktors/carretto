import { hash } from "./hash";
import { Key } from "./key";
import type { MergeProjectionFn } from "./merge-projection-fn";

export const createQueriesMapFactory = <Q extends object, P>(mergeProjection: MergeProjectionFn<P, P>) => (keys: readonly Key<Q, P>[]) => {
	const queriesMap = new Map<string, Key<Q, P>>();
	for (const key of keys) {
		const queryHash = hash(key.query);

		let mappedKey = queriesMap.get(queryHash);
		if (!mappedKey) {
			queriesMap.set(queryHash, key);
			continue;
		}

		const newMappedKey: Key<Q, P> = {
			query: key.query,
			projection: mergeProjection(queriesMap.get(queryHash)!.projection, key.projection),
		};
		if (key.skip) {
			newMappedKey.skip = Math.min(key.skip ?? 0, mappedKey.skip ?? 0);
		}
		if (key.limit) {
			if (key.limit === -1 || mappedKey.limit === -1) {
				newMappedKey.limit = -1;
				queriesMap.set(queryHash, newMappedKey);
				continue;
			}
			newMappedKey.limit = Math.max(key.limit ?? -1, mappedKey.limit ?? -1);
		}

		queriesMap.set(queryHash, newMappedKey);
	}
	return queriesMap;
}
