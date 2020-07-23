const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		this.args.form = new Form({
			_method: 'POST'
			, id: {type:'number', value: 1}
			, name: {}
			, submit: {type: 'submit', value: 'submit'}
		});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
