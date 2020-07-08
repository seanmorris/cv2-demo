import { View as BaseView } from 'curvature/base/View';

import { View as ArrayView } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.args.twoWay = 'Two way binding!';

		this.args.list = ['Milk','Eggs','Bread'];

		this.onFrame(() => {

			this.args.time = (new Date).toISOString();

		});
	}

	addItalicTags(input)
	{
		return `<i>${input}</i>`;
	}

	toJson(input)
	{
		return JSON.stringify(input);
	}

	reverseString(input = '')
	{
		return input.split('').reverse().join('');
	}

	clear(clearVar)
	{
		this.args[clearVar] = '';
	}
}
