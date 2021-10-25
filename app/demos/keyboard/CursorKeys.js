import { View } from 'curvature/base/View';

import { rawquire } from 'rawquire/rawquire.macro';

export class CursorKeys extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./cursor-keys');
	}
}
