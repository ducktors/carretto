import type { Collection, Document, Filter, WithId } from 'mongodb';

import { MainLoader } from '@carretto/main-loader';
import type { Projection } from '@carretto/projection';

import type { Key } from './key';

export class DataloaderMongoDB<T extends WithId<Document>> extends MainLoader<T, Filter<T>> {
  private collection: Collection<T>;

  constructor(collection: Collection<T>) {
    super();
    this.collection = collection;
  }

  protected execute(
    key: Pick<Key<T>, 'query' | 'skip' | 'limit' | 'sort'> & { projection: Projection },
  ) {
    return key.skip !== undefined || key.limit !== undefined
      ? this.collection
          .find<T>(key.query, {
            projection: key.projection,
            limit: key.limit,
            skip: key.skip,
            sort: key.sort,
          })
          .toArray()
      : this.collection.findOne<T>(key.query, { projection: key.projection });
  }
}
