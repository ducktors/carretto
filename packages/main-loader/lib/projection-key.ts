import { Projection } from "@carretto/projection";
import { Key } from "./key";

export type ProjectionKey<Q extends object> = Pick<Key<Q>, 'query' | 'skip' | 'limit'> & { projection: Projection }
