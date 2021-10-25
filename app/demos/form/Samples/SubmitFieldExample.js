const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class SubmitFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./submit-field-template.html');

		const field = {type: 'submit', value: 'submit'};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
