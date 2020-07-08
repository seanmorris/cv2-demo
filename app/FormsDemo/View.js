import { Form } from 'curvature/form/Form';
import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const formSkeleton = {

			_method: 'POST'

			, id: {type:'number', value: 1000}

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
				, children: {

					0: {
						type: 'fieldset'
						, children: {
							id: {type: 'number'}
							, content: {type: 'textarea'}
						}
					}

					, 1: {
						type: 'fieldset'
						, children: {
							id: {type: 'number'}
							, content: {type: 'textarea'}
						}
					}
				}
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
