import { Config } from 'curvature/base/Config';
import { Import } from 'curvature/base/Import';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const vendorJs = new Import('/vendor.js');

		vendorJs.attach();

		this.args.theme = Config.get('theme');
	}
}
