import { Bindable } from 'curvature/base/Bindable';

export class TypeZ
{
	constructor(mainView)
	{
		const _this = Bindable.makeBindable(this);

		this.type  = 'Z';
		this.value = 0;

		this.interval = mainView.onInterval(250, () => {

			_this.value++;

		});

		return _this;
	}
}
