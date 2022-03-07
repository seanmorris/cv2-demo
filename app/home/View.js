import { Database } from 'curvature/model/Database';
import { View as BaseView } from 'curvature/base/View';

import { rawquire } from 'rawquire/rawquire.macro';

const curvature = JSON.parse(rawquire('../../node_modules/curvature/package.json'));

export class View extends BaseView
{
	constructor()
	{
		super();

		this.args.version = curvature.version;

		this.template = require('./template');
	}
}
