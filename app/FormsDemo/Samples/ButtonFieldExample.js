const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class ButtonFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./button-field-template.html');

		const field = {type: 'button', value: 'this is a button'};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
