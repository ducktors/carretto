import { Projection } from '@carretto/projection';

export interface Key<TQuery extends object> {
  query: TQuery;
  projection: Projection;
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}
