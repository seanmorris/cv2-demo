import { View } from 'curvature/base/View';

export class GamepadDemo extends View
{

	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./template.html');

		this.listen(window, 'gamepadconnected', event => this.padConnected(event))

		this.args.pads = [];

		this.args.lx = 0;
		this.args.ly = 0;
		this.args.rx = 0;
		this.args.ry = 0;

		this.args.b0 = 0;
		this.args.b1 = 0;
		this.args.b2 = 0;
		this.args.b3 = 0;
		this.args.b4 = 0;
		this.args.b5 = 0;
		this.args.b6 = 0;
		this.args.b7 = 0;
		this.args.b8 = 0;
		this.args.b9 = 0;
		this.args.b10 = 0;
		this.args.b11 = 0;
		this.args.b12 = 0;
		this.args.b13 = 0;
		this.args.b14 = 0;
		this.args.b15 = 0;
		this.args.b16 = 0;
	}

	padConnected(event)
	{
		const pad = event.gamepad;

		this.args.pads[ pad.index ] = pad;

		const l = ()=> { this.loop(); requestAnimationFrame(l); };

		requestAnimationFrame(l);
	}

	loop()
	{
		const pads = navigator.getGamepads();

		for(let i = 0; i < pads.length; i++)
		{
			const pad = pads[i];

			if(!pad)
			{
				continue;
			}

			this.args.lx = pad.axes[0];
			this.args.ly = pad.axes[1];
			this.args.rx = pad.axes[2];
			this.args.ry = pad.axes[3];

			for(let ii = 0; ii < pad.buttons.length; ii++)
			{
				const button = pad.buttons[ii];

				this.args['b' + ii] = button.value;
			}
		}
	}
}

