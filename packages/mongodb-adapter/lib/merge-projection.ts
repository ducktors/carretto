import { MergeProjectionFn } from '@carretto/main-loader'

import { Projection } from './projection'

export const mergeProjection: MergeProjectionFn<Projection, Projection> = (previousValue, currentValue) => ({
  ...previousValue,
  ...currentValue,
})