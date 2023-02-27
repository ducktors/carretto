import { Key } from './key';

export function updateKeySkip<TQuery extends object>(previous: Pick<Key<TQuery>, 'skip'>, current: Pick<Key<TQuery>, 'skip'>) {
  if (!(previous.skip && current.skip) || previous.skip === 0 || current.skip === 0) {
    return 0;
  }

  return Math.min(previous.skip, current.skip);
}
