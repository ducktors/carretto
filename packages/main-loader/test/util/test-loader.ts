import { Key, MainLoader } from "../../";

export class TestLoader extends MainLoader<void, object> {
  public spy: (key: Key<any>) => Promise<void>;

  constructor(spy: any) {
    super();
    this.spy = spy;
  }

  protected execute(key: Key<any>) {
    return this.spy(key);
  }
}
