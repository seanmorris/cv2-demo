import { View as BaseView } from 'curvature/base/View';

import { SandboxFrame } from '../control/SandboxFrame';

export class View extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent)

		this.template = require('./template');

		this.args.sandbox = new SandboxFrame;
	}
}
