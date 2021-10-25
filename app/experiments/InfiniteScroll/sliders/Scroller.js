import { HyperScroller } from 'cv2-hyperscroll/HyperScroller';

export class Scroller extends HyperScroller
{
	constructor()
	{
		super();

		this.template = require('./scroller');
	}
}
