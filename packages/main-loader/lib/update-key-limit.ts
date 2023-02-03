import { Key } from './key';

export function updateKeyLimit<Q extends object>(previous: Key<Q>, current: Key<Q>) {
  if (!(previous.limit && current.limit) || previous.limit === -1 || current.limit === -1) {
    return -1;
  }

  if (!current.limit && previous.limit) {
    return previous.limit;
  }
  if (!previous.limit && current.limit) {
    return current.limit;
  }
  return Math.max(previous.limit, current.limit);
}
