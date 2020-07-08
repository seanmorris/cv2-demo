import { TypeZ } from './TypeZ';

export class TypeZAlpha extends TypeZ
{
	constructor(mainView)
	{
		super(mainView);

		this.type = 'Z𝛼';

		clearInterval(this.interval);

		this.interval = mainView.onInterval(20, () => {

			this.value++;

		});
	}
}

