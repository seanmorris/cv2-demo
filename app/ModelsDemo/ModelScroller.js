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
		console.log(x);

		return JSON.stringify(x);
	}
}
