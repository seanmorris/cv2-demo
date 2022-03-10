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

		this.addEventListener('remove', () => this.args.demo && this.args.demo.close());
	}

	join()
	{
		this.args.demo = new JoinDemo({},this);
		this.args.demo.addEventListener('closed', e => this.args.demo = null);
	}

	host()
	{
		this.args.demo = new HostDemo({},this);
		this.args.demo.addEventListener('closed', e => this.args.demo = null);
	}
}
