import { View } from 'curvature/base/View';
import { Config } from 'curvature/base/Config';

export class SvgExample extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./ps3-input.svg');

		this.onFrame(() => {
			if(Date.now() - this.throttle > 75)
			{
				this.args.x *= 0.75;
				this.args.y *= 0.75;
			}

			this.leftStick.style({
				transform: `translate(${this.args.x * 2}px, ${this.args.y * 2}px)`
			});
		});

		this.throttle = 0;
		this.args.x = 0;
		this.args.y = 0;
	}

	onAttached()
	{
		this.leftStick = this.findTag('[data-button~=left-stick]');

		this.leftStick.style({transition:  `transform 0.1s ease-out`});
	}

	mousemove(event)
	{
		if(Date.now() - this.throttle > 50)
		{
			return;
		}

		this.throttle = Date.now();

		let x = event.movementX, y = event.movementY;

		this.args.x = Math.min(1, Math.max(Math.abs(this.args.x), Math.abs(x / 15))) * Math.sign(x);
		this.args.y = Math.min(1, Math.max(Math.abs(this.args.y), Math.abs(y / 15))) * Math.sign(y);
	}
}
