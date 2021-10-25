import { Mixin } from 'curvature/base/Mixin';
import { EventTargetMixin } from 'curvature/mixin/EventTargetMixin';
import { PromiseMixin } from 'curvature/mixin/PromiseMixin';

export class Countdown
extends Mixin.with(EventTargetMixin, PromiseMixin)
{
	constructor(countdown = 1000)
	{
		super();

		this.countdown = countdown;

		this.interval = setInterval(() => this.tick(), 10);
	}

	tick()
	{
		this.countdown--;

		if(this.countdown <= 0)
		{
			clearInterval(this.interval);

			this[PromiseMixin.Accept]('done');
		}

		const event = new CustomEvent('tick', {detail: this.countdown});

		this.dispatchEvent(event);
	}

	cancel()
	{
		if(this.countdown > 0)
		{
			clearInterval(this.interval);

			this[PromiseMixin.Reject]('cancelled');
		}
	}
}
