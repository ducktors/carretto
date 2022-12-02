import { hash } from "./hash";
import { Key } from "./key";

export function createQueriesMap(keys: readonly Key[]) {
	const queriesMap = new Map<string, Key>();
	for (const key of keys) {
		const queryHash = hash(key.query);

		let mappedKey = queriesMap.get(queryHash);
		if (!mappedKey) {
			queriesMap.set(queryHash, key);
			continue;
		}

		const newMappedKey: Key = {
			query: key.query,
			projection: {
				...queriesMap.get(queryHash)!.projection,
				...key.projection,
			},
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
