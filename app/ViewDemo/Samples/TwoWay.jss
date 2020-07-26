const View = require('curvature/base/View').View;

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
		this.args.val = (0xFFFF * Math.random()).toString(36);
	}

	clear()
	{
		this.args.val = '';
	}
}
