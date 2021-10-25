import { View } from 'curvature/base/View';
import { Config } from 'curvature/base/Config';
import { Countdown } from './Countdown'

export class MixinExample extends View
{
	constructor()
	{
		super();

		this.template = require('./mixin-example-template.html');

		this.args.status = 'done';

		this.reset();
	}

	reset()
	{
		if(this.countdown)
		{
			this.countdown.cancel();
		}

		this.countdown = new Countdown;

		this.countdown.addEventListener('tick', event => {
			this.args.lastTick = Number(event.detail / 100).toFixed(2);
			this.args.status   = 'running';
		});

		this.countdown
		.then(status => this.args.status = status)
		.catch(error => this.args.status = error);

		this.args.lastTick = '...';

	}

	cancel()
	{
		this.countdown.cancel();
	}
}
