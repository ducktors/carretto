import type { Filter } from 'mongodb';

import type { Key as MainLoaderKey } from '@carretto/main-loader';

export type Key<T> = MainLoaderKey<Filter<T>>;
