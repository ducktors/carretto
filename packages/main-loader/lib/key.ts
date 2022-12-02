import { Filter } from "mongodb";

export interface Key {
	query: Filter<unknown>;
	projection: { [k: string]: 1 };
	skip?: number;
	limit?: number;
}
