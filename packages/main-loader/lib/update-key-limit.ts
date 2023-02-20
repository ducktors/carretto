import { Key } from './key';

export function updateKeyLimit<Q extends object>(previous: Key<Q>, current: Key<Q>) {
  if (!(previous.limit && current.limit ) || previous.limit === 0 || current.limit === 0) {
    return 0;
  }

  return Math.max(previous.limit, current.limit);
}
