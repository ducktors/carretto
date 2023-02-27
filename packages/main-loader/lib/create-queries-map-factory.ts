import { hash } from './hash';
import { mergeProjections } from '@carretto/projection';
import { updateKeyLimit } from './update-key-limit';
import { updateKeySkip } from './update-key-skip';
import { Key } from './key';

export const createQueriesMapFactory =
  <TQuery extends object>() =>
  (keys: readonly Key<TQuery>[]) => {
    const queriesMap = new Map<string, Key<TQuery>>();
    for (const key of keys) {
      const queryHash = hash(key.query);

      let mappedKey = queriesMap.get(queryHash);
      if (!mappedKey) {
        queriesMap.set(queryHash, key);
        continue;
      }

      const newMappedKey: Key<TQuery> = {
        query: key.query,
        projection: mergeProjections(queriesMap.get(queryHash)!.projection, key.projection),
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
