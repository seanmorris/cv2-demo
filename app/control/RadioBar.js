import { View } from 'curvature/base/View';

export class RadioBar extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./radio-bar');

		this.args.buttons = [];

		this.args.bindTo('buttons', v => {

			this.initialHighlight = true;

			this.args.selected = this.args.selected || 0;

			this.onNextFrame(() => this.highlight());

		}, {children:true});

	}

	onAttached()
	{
		if(this._attached)
		{
			return;
		}

		this.args.selected = this.args.selected || 0;

		this.highlight();
	}

	click(event, button, index)
	{
		this.args.selected = index;

		this.highlight();

		button.callback(event);
	}

	highlight()
	{
		const index = this.args.selected;

		if(index < 0)
		{
			this.tags.highlight.style({
				height:   0
				, width:  0
				, top:    0
				, left:   0
			});
		}

		if(!this.tags.buttons || !this.tags.buttons[index])
		{
			return;
		}

		const button = this.tags.buttons[index];

		this.tags.highlight.style({
			transform: `translate(${button.offsetLeft}px, ${button.offsetTop}px)`
			, width:   `${button.offsetWidth}px`
			, height:  `${button.offsetHeight}px`
		});
	}
}
