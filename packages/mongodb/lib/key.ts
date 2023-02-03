import { Filter } from 'mongodb';

import { Key as MainLoaderKey } from '@carretto/main-loader';

export type Key<T> = MainLoaderKey<Filter<T>>;
