import { Collection, Document, WithId } from "mongodb";

import { Key, MainLoader } from 'main-loader'

export class DataloaderMongoDB<T extends WithId<Document>> extends MainLoader<T> {
	private collection: Collection<Document>;

	constructor(collection: Collection<Document>) {
		super()
		this.collection = collection;
	}

	protected execute(key: Key) {
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
