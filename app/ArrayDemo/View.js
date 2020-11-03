import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template  = require('./template');
		this.z         = 0;
		this.routes    = {};
		this.args.list = [0,1,2,3,4,5];
		this.args.obj  = {a: 1, b: 2, c: 3};
	}

	splice(position, del, item = undefined)
	{
		if(item == undefined)
		{
			this.args.list.splice(position, del);
			return;
		}

		this.args.list.splice(position, del, item);
	}

	arrayUnshift()
	{
		this.args.list.unshift((this.z++) + ' new_shift' );
	}

	arrayShift()
	{
		this.args.list.shift();
	}

	arrayPush()
	{
		this.args.list.push((this.z++) + ' new_push');
	}

	arrayPop()
	{
		this.args.list.pop();
	}

	arraySort()
	{
		this.args.list.sort();
	}

	arrayReverse()
	{
		this.args.list = this.args.list.reverse();
	}

	setIndex(key, value)
	{
		this.args.list[ key ] = value;
	}

	delIndex(key)
	{
		delete this.args.list[ key ];

		console.log(this.args.list);
	}
}
