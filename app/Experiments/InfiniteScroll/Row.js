import { View as BaseView } from 'curvature/base/View';

export class Row extends BaseView
{
	constructor(content, index, container)
	{
		super({content, index});

		this.container = container;

		this.template = require('./row');

		this.visible = true;

		this.args.x = Math.random();

		this.preserve = true;
	}

	postRender()
	{
		const containerTag = this.container.containerTag;
		const rowTag       = this.findTag('div[data-tag="row"]');

		const observer = new IntersectionObserver(
			(e,o) => this.scrollObserved(e,o)
			, {root: containerTag}
		);

		observer.observe(rowTag);
	}

	scrollObserved(entries, observer)
	{
		let visible = false;

		for(const entry of entries)
		{
			if(entry.intersectionRatio)
			{
				visible = true;
				break;
			}
		}

		this.visible = visible;
	}
}
