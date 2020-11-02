import { Tag } from 'curvature/base/Tag';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');
	}
}
