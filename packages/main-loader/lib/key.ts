export interface Key<Q extends object, P> {
	query: Q;
	projection: P;
	skip?: number;
	limit?: number;
}
