import { hash } from './hash';
import { mergeProjections } from '@carretto/projection';
import { updateKeyLimit } from './update-key-limit';
import { updateKeySkip } from './update-key-skip';
import { ProjectionKey } from './projection-key';

export const createQueriesMapFactory =
  <Q extends object>() =>
  (keys: readonly ProjectionKey<Q>[]) => {
    const queriesMap = new Map<string, ProjectionKey<Q>>();
    for (const key of keys) {
      const queryHash = hash(key.query);

      let mappedKey = queriesMap.get(queryHash);
      if (!mappedKey) {
        queriesMap.set(queryHash, key);
        continue;
      }

      const newMappedKey: ProjectionKey<Q> = {
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
