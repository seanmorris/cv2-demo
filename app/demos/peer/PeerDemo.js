import { View } from 'curvature/base/View';

import { JoinDemo  } from './JoinDemo';
import { HostDemo  } from './HostDemo';

export class PeerDemo extends View
{
	template = require('./peer-demo.html');

	constructor(args, parent)
	{
		super(args, parent);

		this.args.demo = null;
	}

	join()
	{
		this.args.demo = new JoinDemo;
	}

	host()
	{
		this.args.demo = new HostDemo;
	}
}
