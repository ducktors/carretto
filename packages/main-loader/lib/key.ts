import { Projection } from "./projection";

export interface Key<Q extends object> {
	query: Q;
	projection: Projection;
	skip?: number;
	limit?: number;
}
