import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template  = require('./template');
		this.z         = 0;
		this.args.obj  = {a: 1, b: 2, c: 3};
	}

	setKey(key, value)
	{
		this.args.obj[ key ] = value;
	}

	delKey(key)
	{
		delete this.args.obj[ key ];
	}
}
