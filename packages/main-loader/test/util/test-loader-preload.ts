import { type Key, MainLoader } from '../../src';
interface TestQuery {
  test: string;
  added?: string;
}

export class TestLoader extends MainLoader<void, TestQuery> {
  public spy: (key: Key<TestQuery>) => Promise<void>;

  constructor(spy: any) {
    super();
    this.spy = spy;
  }

  protected preLoad(key: Key<TestQuery>) {
    const { query: queryKey, ...restKey } = key;
    return {
      query: { added: 'added', ...queryKey },
      ...restKey,
    };
  }

  protected execute(key: Key<any>) {
    return this.spy(key);
  }
}
