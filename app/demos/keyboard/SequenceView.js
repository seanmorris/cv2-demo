import { View } from 'curvature/base/View';
import { Sequence } from 'curvature/input/Sequence';

export class SequenceView extends View
{
	template = require('./sequence.html');

	constructor(args, parent)
	{
		super(args, parent);

		const sequence = this.args.sequence = this.args.sequence || new Sequence({});

		this.args.keys = this.args.sequence.keys;

		sequence.addEventListener('complete', event => {
			if(this.matchTimer)
			{
				clearTimeout(this.matchTimer);
			}
			this.args.match = 'matching';
		});

		sequence.addEventListener('advance', event => {
			if(this.matchTimer)
			{
				clearTimeout(this.matchTimer);
			}
			this.args.matches = event.detail.matched;
			this.args.match = 'partial';
			this.matchTimer = this.onTimeout(
				sequence.timing
				, () => this.args.match = ''
			)
		});

		sequence.addEventListener('cancel', event => {
			if(this.matchTimer)
			{
				clearTimeout(this.matchTimer);
			}
			this.args.matches = event.detail.matched;
			this.args.match = 'no-match';
		});
	}
}
