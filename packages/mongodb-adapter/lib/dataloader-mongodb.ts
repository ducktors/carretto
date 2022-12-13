import { Collection, Document, Filter, WithId } from "mongodb";

import { MainLoader, MergeProjectionFn } from '@carretto/main-loader'

import { mergeProjection } from "./merge-projection";
import type { Projection } from './projection'
import { Key } from "./key";

export class DataloaderMongoDB<T extends WithId<Document>> extends MainLoader<T, Filter<T>, Projection> {
	private collection: Collection<T>;

	constructor(collection: Collection<T>) {
		super()
		this.collection = collection;
	}

	protected mergeProjection: MergeProjectionFn<Projection, Projection> = mergeProjection
	protected execute(key: Key<T>) {

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
