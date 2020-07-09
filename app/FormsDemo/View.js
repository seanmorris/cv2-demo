import { Form } from 'curvature/form/Form';
import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const commentField = {
			type: 'fieldset'
			, array: true
			, children: {
				id: {type: 'number'}
				, content: {
					type: 'textarea',
					name: 'comments[0][content]'

				}
			}
		};

		const formSkeleton = {

			_method: 'POST'

			, hidden: {type:'hidden', value: 'LMAO YOU CANT SEE MEE'}

			, id: {type:'number', value: 1000}
			, name: {}

			, access: {
				type:    'radios'
				, options: {
					'private':  0
					, 'public': 1
				}
			}

			, image: {type: 'file'}

			, type: {
				type:    'select'
				, value: 300
				, options: {
					'-select-': null
					, 'image':  100
					, 'text':   200
					, 'video':  300
				}
			}

			, comments: {
				name: 'comments'
				, type: 'fieldset'
				, array: true
				, children: {
					0: Object.assign({}, commentField)
					, 1: Object.assign({}, commentField)
				}
			}

			, submit: {
				type: 'submit'
			}
		};

		const form = new Form(formSkeleton);

		form.bindTo('json', v => this.args.output = this.toJson(form.value));

		this.args.form = form;
		this.args.formSkeleton = formSkeleton;
	}

	postRender()
	{
	}

	toJson(input)
	{
		return JSON.stringify(input, null, 2);
	}
}
