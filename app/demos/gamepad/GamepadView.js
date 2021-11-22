import { View } from 'curvature/base/View';

export class GamepadView extends View
{
	template = require('./gamepad.html');

	constructor(args, parent)
	{
		console.log(args);

		super(args, parent);

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

	onLoop()
	{
		const pad = this.args.pad;

		const minDead = 0.20;

		this.args.lx = Number(pad.axes[0].magnitude);
		this.args.ly = Number(pad.axes[1].magnitude);
		this.args.rx = Number(pad.axes[2].magnitude);
		this.args.ry = Number(pad.axes[3].magnitude);

		this.args.lxAdjust = (Math.abs(pad.axes[0].magnitude) > minDead ? pad.axes[0].magnitude : 0).toFixed(2);
		this.args.lyAdjust = (Math.abs(pad.axes[1].magnitude) > minDead ? pad.axes[1].magnitude : 0).toFixed(2);
		this.args.rxAdjust = (Math.abs(pad.axes[2].magnitude) > minDead ? pad.axes[2].magnitude : 0).toFixed(2);
		this.args.ryAdjust = (Math.abs(pad.axes[3].magnitude) > minDead ? pad.axes[3].magnitude : 0).toFixed(2);

		const lMag = Math.sqrt(this.args.lxAdjust**2 + this.args.lyAdjust**2);

		if(lMag > 1)
		{
			this.args.lxAdjust /= lMag;
			this.args.lyAdjust /= lMag;
		}

		const rMag = Math.sqrt(this.args.rxAdjust**2 + this.args.ryAdjust**2);

		if(rMag > 1)
		{
			this.args.rxAdjust /= rMag;
			this.args.ryAdjust /= rMag;
		}

		for(const ii in pad.buttons)
		{
			const button = pad.buttons[ii];

			this.args['b' + ii] = button.pressure;
		}
	}

	rumble()
	{
		this.args.pad.rumble();
	}
}
