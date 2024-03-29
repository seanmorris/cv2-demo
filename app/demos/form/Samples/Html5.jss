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
			, id:        {type:'number', value: 1}
			, name:      {}
			, phone:     {type:'tel',attrs:{pattern:'[0-9]{3}-[0-9]{2}-[0-9]{3}'}}
			, favColor:  {type:'color', title: 'Favorite Color'}
			, birthday:  {type:'date'}
			, available: {type:'time'}
			, week:      {type:'week'}
			, email:     {type:'email'}
			, homepage:  {type:'url'}
			, submit:    {type: 'submit', value: 'submit'}
		});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
