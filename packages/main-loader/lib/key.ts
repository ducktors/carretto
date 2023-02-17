import { Projection } from './projection';

export interface Key<Q extends Record<string, any>> {
  query: Q;
  projection: Projection;
  skip?: number;
  limit?: number;
}
