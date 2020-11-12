import { View } from 'curvature/base/View';

import { rawquire } from 'rawquire/rawquire.macro';

export class Keyboard extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./keyboard');
	}
}
