import { Key } from './key';

export function updateKeySkip<Q extends object>(previous: Key<Q>, current: Key<Q>) {
  if (!(previous.skip && current.skip) || previous.skip === 0 || current.skip === 0) {
    return 0;
  }

  if (!current.skip && previous.skip) {
    return previous.skip;
  }
  if (!previous.skip && current.skip) {
    return current.skip;
  }
  return Math.min(previous.skip, current.skip);
}
