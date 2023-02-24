import { Key } from './key';

export function updateKeyLimit<Q extends object>(previous: Pick<Key<Q>, 'limit'>, current: Pick<Key<Q>, 'limit'>) {
  if (!(previous.limit && current.limit ) || previous.limit === 0 || current.limit === 0) {
    return 0;
  }

  return Math.max(previous.limit, current.limit);
}
