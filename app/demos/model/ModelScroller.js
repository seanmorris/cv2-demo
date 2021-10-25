import { HyperScroller } from 'cv2-hyperscroll/HyperScroller';

export class ModelScroller extends HyperScroller
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
