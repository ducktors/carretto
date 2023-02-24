import { Key } from './key';

export function updateKeySkip<Q extends object>(previous: Pick<Key<Q>, 'skip'>, current: Pick<Key<Q>, 'skip'>) {
  if (!(previous.skip && current.skip) || previous.skip === 0 || current.skip === 0) {
    return 0;
  }

  return Math.min(previous.skip, current.skip);
}
