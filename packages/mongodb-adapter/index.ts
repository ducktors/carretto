import { Collection, Document, Filter, WithId } from "mongodb";

import { Key, MainLoader, MergeProjectionFn } from '@carretto/main-loader'
import { mergeProjection, Projection } from "./lib";

export class DataloaderMongoDB<T extends WithId<Document>> extends MainLoader<T, Filter<T>, Projection> {
	private collection: Collection<Document>;

	constructor(collection: Collection<Document>) {
		super()
		this.collection = collection;
	}

	protected mergeProjection: MergeProjectionFn<Projection, Projection> = mergeProjection

	protected execute(key: Key<Filter<T>, Projection>) {
		return key.skip !== undefined || key.limit !== undefined
			? this.collection
						.find<T>(key.query, {
							projection: key.projection,
							limit: key.limit ?? -1,
							skip: key.skip ?? 0,
						})
						.toArray()
			: this.collection.findOne<T>(key.query, { projection: key.projection });
	}
}
