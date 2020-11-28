const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class HiddenFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./hidden-field-template.html');

		const field = {
			title:   'Hidden field'
			, type:  'hidden'
			, value: 'You cant see me.'
		};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
