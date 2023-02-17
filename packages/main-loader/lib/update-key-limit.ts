import { Key } from './key';

export function updateKeyLimit<Q extends Record<string, any>>(previous: Key<Q>, current: Key<Q>) {
  if (!(previous.limit && current.limit) || previous.limit === 0 || current.limit === 0) {
    return 0;
  }

  if (!current.limit && previous.limit) {
    return previous.limit;
  }
  if (!previous.limit && current.limit) {
    return current.limit;
  }
  return Math.max(previous.limit, current.limit);
}
