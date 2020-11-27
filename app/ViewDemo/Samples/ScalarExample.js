const View = require('curvature/base/View').View;

export class ScalarExample extends View
{
	constructor()
	{
		super();

		this.template = require('./scalar-template.html');

		this.args.time = (new Date()).toISOString();

		this.onFrame(() => {

			this.args.time = (new Date()).toISOString();

		});
	}

	addItalicTags(input)
	{
		return `<i>${input}</i>`;
	}

	reverseString(input = '')
	{
		return input.split('').reverse().join('');
	}
}
