import { Key, MainLoader } from '../../'

export class TestLoader extends MainLoader<void, object> {
	public spy: (key: Key<any>) => Promise<void>;

	constructor(spy: (key: Key<any>) => Promise<void>) {
		super()
		this.spy = spy
	}

	protected execute(key: Key<any>) {
    return this.spy(key)
	}
}
