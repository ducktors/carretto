import { GraphQLResolveInfo } from 'graphql';

export interface Key<Q extends object> {
  query: Q;
  info: GraphQLResolveInfo;
  skip?: number;
  limit?: number;
}
