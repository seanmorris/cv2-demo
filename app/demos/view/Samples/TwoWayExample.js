const View = require('curvature/base/View').View;

export class TwoWayExample extends View
{
	constructor()
	{
		super();
		this.template = require('./two-way-template.html');
		this.args.val = '';
	}

	random()
	{
		this.args.val = (0xFFFFFF * Math.random()).toString(36);
	}

	clear()
	{
		this.args.val = '';
	}
}
