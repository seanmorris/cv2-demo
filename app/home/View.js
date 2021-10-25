import { Database } from 'curvature/model/Database';
import { View as BaseView } from 'curvature/base/View';

import { rawquire } from 'rawquire/rawquire.macro';

const cv2Playground = JSON.parse(rawquire('../../package-lock.json'));

export class View extends BaseView
{
	constructor()
	{
		super();

		this.args.version = cv2Playground.dependencies.curvature.version;

		this.template = require('./template');
	}
}
