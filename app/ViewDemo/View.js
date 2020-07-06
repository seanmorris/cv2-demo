import { View as BaseView } from 'curvature/base/View';

import { View as ArrayView } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

	}

	clear(clearVar)
	{
		this.args[clearVar] = '';
	}
}
