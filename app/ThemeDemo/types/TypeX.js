import { Bindable } from 'curvature/base/Bindable';

export class TypeX
{
	constructor(mainView)
	{
		const _this = Bindable.makeBindable(this);

		this.type  = 'X';
		this.value = 1/Math.random();

		this.interval = mainView.onInterval(100, () => {

			_this.value = '0x' + Math.floor(Math.random() * 10000)
				.toString(16)
				.padStart(4, 0);

		});
	}
}
