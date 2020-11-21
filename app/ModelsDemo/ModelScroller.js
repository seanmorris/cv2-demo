import { InfiniteScroller } from '../Experiments/InfiniteScroll/lib/InfiniteScroller';

export class ModelScroller extends InfiniteScroller
{
	constructor()
	{
		super();

		this.template = require('./scroller');
	}

	toJson(x)
	{
		return JSON.stringify(x);
	}

	focus(event)
	{
		if(event.target.matches('[data-property="id"],[data-property="class"]'))
		{
			event.target.blur();
		}
	}
}
