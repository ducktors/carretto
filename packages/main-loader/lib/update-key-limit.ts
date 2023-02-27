import { Key } from './key';

export function updateKeyLimit<TQuery extends object>(previous: Pick<Key<TQuery>, 'limit'>, current: Pick<Key<TQuery>, 'limit'>) {
  if (!(previous.limit && current.limit ) || previous.limit === 0 || current.limit === 0) {
    return 0;
  }

  return Math.max(previous.limit, current.limit);
}
