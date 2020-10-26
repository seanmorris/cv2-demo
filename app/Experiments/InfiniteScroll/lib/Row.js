import { View as BaseView } from 'curvature/base/View';

export class Row extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent);

		this.visible  = true;
		this.preserve = true;
	}

	attached()
	{
		const rowTag = this.tags.row;

		rowTag.style.setProperty('--index', this.args.r);

		rowTag.style.position = 'absolute';
		rowTag.style.height   = 'var(--rowHeight)';
		rowTag.style.transform = `translateY(var(--scrollOffset))`;
		rowTag.style.top      = 'calc( var(--rowHeight) * var(--index)';

		
		const observer = new IntersectionObserver(
			(e,o) => this.scrollObserved(e,o)
			, {root: this.parent.container}
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