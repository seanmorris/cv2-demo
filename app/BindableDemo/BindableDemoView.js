import { View } from 'curvature/base/View';

export class BindableDemoView extends View
{
	constructor(args = {}, parent)
	{
		super(args, parent);

		this.template = require('./bindable-demo');
	}
}
