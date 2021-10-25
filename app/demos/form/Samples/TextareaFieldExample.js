const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class TextareaFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./textarea-field-template.html');

		const field = {
			title:  'Textarea Field'
			, type: 'textarea'
		};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
