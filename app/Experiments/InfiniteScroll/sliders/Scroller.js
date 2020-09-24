import { InfiniteScroller } from '../lib/InfiniteScroller';

export class Scroller extends InfiniteScroller
{
	constructor()
	{
		super();

		this.template = require('./scroller');
	}
}
