const View = require('curvature/base/View').View;

export class ArrayExample extends View
{
	constructor()
	{
		super();

		this.template = require('./array-template.html');

		this.args.list = [
			'Milk'
			, 'Eggs'
			, 'Bread'
			, 'Cheese'
		];
	}

	arraySort()
	{
		this.args.list.sort();
	}

	arrayShuffle()
	{
		this.args.list.sort((a,b) => Math.random() > 0.3 ? -1 : 1);
	}

	arrayReverse()
	{
		this.args.list = this.args.list.reverse();
	}
}
