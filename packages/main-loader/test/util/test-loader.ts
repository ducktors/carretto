import { Key, MainLoader } from '../../'

export class TestLoader extends MainLoader<void> {
	public spy: (key: Key) => Promise<void>;

	constructor(spy: (key: Key) => Promise<void>) {
		super()
		this.spy = spy
	}

	protected execute(key: Key) {
    return this.spy(key)
	}
}
