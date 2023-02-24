import { MainLoader } from '../../';
import { ProjectionKey } from '../../lib/projection-key';

export class TestLoader extends MainLoader<void, object> {
  public spy: (key: ProjectionKey<any>) => Promise<void>;

  constructor(spy: (key: ProjectionKey<any>) => Promise<void>) {
    super();
    this.spy = spy;
  }

  protected execute(key: ProjectionKey<any>) {
    return this.spy(key);
  }
}
