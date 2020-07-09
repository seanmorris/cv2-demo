class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		this.args.list = ['Milk','Eggs','Bread'];
	}

	toJson(input)
	{
		return JSON.stringify(input);
	}
}
