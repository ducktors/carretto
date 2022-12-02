import { Document, Filter, ObjectId } from "mongodb";
import { default as objectHash } from "object-hash";

export function hash(query: Filter<Document>) {
	return objectHash(query, {
		algorithm: "sha1",
		replacer: (value: any) => {
			// object-hash doesn't support ObjectId types out of the box
			if (value instanceof ObjectId) {
				value = value.toString();
			}
			return value;
		},
	});
}
