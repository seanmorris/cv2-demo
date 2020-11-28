const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class FileFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./file-field-template.html');

		const field = {
			title:   'File field'
			, type:  'file'
		};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
