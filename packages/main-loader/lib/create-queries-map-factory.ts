import { hash } from './hash';
import { Key } from './key';
import { updateKeyLimit } from './update-key-limit';
import { updateKeySkip } from './update-key-skip';

export const createQueriesMapFactory =
  <Q extends object>() =>
  (keys: readonly Key<Q>[]) => {
    const queriesMap = new Map<string, Key<Q>>();
    for (const key of keys) {
      const queryHash = hash(key.query);

      let mappedKey = queriesMap.get(queryHash);
      if (!mappedKey) {
        queriesMap.set(queryHash, key);
        continue;
      }

      const newMappedKey: Key<Q> = {
        query: key.query,
        projection: { ...queriesMap.get(queryHash)!.projection, ...key.projection },
      };

      if (Object.hasOwn(key, 'skip')) {
        newMappedKey.skip = updateKeySkip(mappedKey, key);
      }
      if (Object.hasOwn(key, 'limit')) {
        newMappedKey.limit = updateKeyLimit(mappedKey, key);
      }

      queriesMap.set(queryHash, newMappedKey);
    }
    return queriesMap;
  };
