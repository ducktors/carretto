import * as dotObject from 'dot-object';

import type { Projection } from './projection';

export function mergeProjections(old?: Projection, curr?: Projection) {
  let result = {};

  if (old) {
    result = old;
  }
  if (curr) {
    const oldTree = dotObject.object(result);
    const currTree = dotObject.object(curr);

    result = deepMerge(oldTree, currTree);
  }
  return dotObject.dot(result ?? curr);
}

// taken from https://github.com/vuejs/create-vue/blob/main/utils/deepMerge.ts
const isObject = (val: any) => val && typeof val === 'object';
// const mergeArrayWithDedupe = (a: any, b: any) =>
//   Array.from(new Set([...a, ...b]))

export function deepMerge(target: any, obj: any) {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key];
    const newVal = obj[key];

    if (oldVal === 1) {
      return { ...obj, ...target };
      // biome-ignore lint/style/noUselessElse: too risky to remove
    } else if (newVal === 1) {
      return { ...target, ...obj };
      // biome-ignore lint/style/noUselessElse: too risky to remove
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal);
    } else {
      target[key] = newVal;
    }
  }

  return target;
}
