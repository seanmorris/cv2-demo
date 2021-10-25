import { Bindable } from 'curvature/base/Bindable';

export class TypeX
{
	constructor(mainView)
	{
		this.type  = 'X';
		this.value = 1/Math.random();

		const _this = Bindable.make(this);

		this.interval = mainView.onInterval(50, () => {
			_this.value = '0x' + Math.floor(Math.random() * 10000)
				.toString(16)
				.padStart(4, 0);

		});
	}
}
