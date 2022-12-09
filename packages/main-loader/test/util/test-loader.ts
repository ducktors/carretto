import { Key, MainLoader } from '../../'

export class TestLoader extends MainLoader<void, object, object> {
	public spy: (key: Key<any, any>) => Promise<void>;

	constructor(spy: (key: Key<any, any>) => Promise<void>) {
		super()
		this.spy = spy
	}

	protected execute(key: Key<any, any>) {
    return this.spy(key)
	}

	protected mergeProjection = (previousValue: object, currentValue: object) => ({ ...previousValue, ...currentValue })
}
