const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class TextFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./text-field-template.html');

		const field = {
			title:  'Text Field'
			, type: 'text'
		};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
