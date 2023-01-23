import { Collection, Document, Filter, WithId } from "mongodb";

import { MainLoader } from '@carretto/main-loader'

import { Key } from "./key";

export class DataloaderMongoDB<T extends WithId<Document>> extends MainLoader<T, Filter<T>> {
	private collection: Collection<T>;

	constructor(collection: Collection<T>) {
		super()
		this.collection = collection;
	}

	protected execute(key: Key<T>) {
		return key.skip !== undefined || key.limit !== undefined
			? this.collection
						.find<T>(key.query, {
							projection: key.projection,
							limit: key.limit,
							skip: key.skip,
						})
						.toArray()
			: this.collection.findOne<T>(key.query, { projection: key.projection });
	}
}
