import { View } from 'curvature/base/View';

export class LoneScrollbar extends View
{
	constructor(args = {}, parent)
	{
		super(args, parent);

		this.template = require('./lone-scrollbar');

		this.args.size  = args.size  || 10000;
		this.args.value = args.value || 0;
	}

	attached()
	{
		this.args.bindTo('value', v => {

			if(v === 0)
			{
				this.tags.scroller[posKey] = 0;
				this.args.position = 0;
				return;
			}

			const scrollMax = this.tags.scroller[ this.args.horizontal
				? 'scrollWidth'
				: 'scrollHeight'
			];

			const scrollVisible  = this.tags.scroller[ this.args.horizontal
				? 'clientWidth'
				: 'clientHeight'
			];

			const posKey = this.args.horizontal
				? 'scrollLeft'
				: 'scrollTop';

			const position = (v / this.args.size) * (scrollMax - scrollVisible);

			this.tags.scroller[posKey] = position;
			this.args.position = position;

		}, {frame: 1, throttle: 1000, wait: 100});

		this.args.bindTo('horizontal', v => {

			this.tags.wrapper.attr({
				'data-orientation': v
					? 'horizontal'
					: 'vertical'
			});

			if(v)
			{
				this.tags.shim.style({
					'width': `${this.args.size}%`
				});
			}
			else
			{
				this.tags.shim.style({
					'height': `${this.args.size}%`
				});
			}
		});

		this.listen(
			this.tags.scroller
			, 'scroll'
			, event => {
				const scrollPos = event.target[ this.args.horizontal
					? 'scrollLeft'
					: 'scrollTop'
				];

				const scrollMax = event.target[ this.args.horizontal
					? 'scrollWidth'
					: 'scrollHeight'
				];

				const scrollVisible  = event.target[ this.args.horizontal
					? 'clientWidth'
					: 'clientHeight'
				];

				this.args.value = Math.round(this.args.size * (scrollPos / (scrollMax - scrollVisible)));
			}
		);
	}
}
