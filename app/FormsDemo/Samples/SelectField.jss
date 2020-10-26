const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		const field = {
			title:   'Select Field'
			, type:  'select'
			, value: 3
			, options: {
				'Select One': null
				, 'Red':   1
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
