const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class CheckboxFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./checkbox-field-template.html');

		const field = {
			title:   'Checkbox Field'
			, type:  'checkbox'
		};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
