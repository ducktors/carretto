import { Projection } from '@carretto/projection';

export interface Key<TQuery extends object, TSort = Record<string, 1 | -1>> {
  query: TQuery;
  projection: Projection;
  skip?: number;
  limit?: number;
  sort?: TSort;
}
