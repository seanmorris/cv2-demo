const View = require('curvature/base/View').View;

export class ArrayExample extends View
{
	constructor()
	{
		super();

		this.template = require('./array-template.html');

		this.args.list = ['Milk','Eggs','Bread'];
	}
}
