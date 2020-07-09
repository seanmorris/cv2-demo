class DemoView extends View
{
	constructor()
	{
		super();
		this.template = require('template');
		this.args.val = '';
	}

	random()
	{
		this.args.val = 1/Math.random();
	}

	clear()
	{
		this.args.val = '';
	}
}
