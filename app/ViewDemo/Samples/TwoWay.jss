class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		this.args.twoWay = 0;

		this.onInterval(1000, () => {
			this.args.twoWay = (new Date).toISOString();
		});
	}

	clear()
	{
		this.args.twoWay = '';
	}
}
