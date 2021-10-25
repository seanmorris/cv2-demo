const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		const personField = {
			type:    'fieldset'
			, title: 'Person'
			, array: true
			, children: {
				id: {type:'number'}
				, name:  {}
			}
		};

		const peopleField = {
			type:    'fieldset'
			, title: 'People'
			, array: true
			, children: [
				personField
				, personField
				, personField
			]
		};

		this.args.form = new Form({
			_method:  'POST'
			, field:  peopleField
			, submit: {type: 'submit', value: 'submit'}
		});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
