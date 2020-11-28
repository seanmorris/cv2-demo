const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

export class RadioFieldExample extends View
{
	constructor()
	{
		super();

		this.template = require('./radio-field-template.html');

		const field = {
			title:   'Radio Field'
			, type:  'radios'
			, value: 2
			, options: {
				'Red':     1
				, 'Blue':  2
				, 'Green': 3
			}
		};

		this.args.form = new Form({field});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
