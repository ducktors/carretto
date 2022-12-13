import { Key as MainLoaderKey} from '@carretto/main-loader'
import { Filter } from 'mongodb'
import { Projection } from './projection'

export type Key<T> = MainLoaderKey<Filter<T>, Projection>
