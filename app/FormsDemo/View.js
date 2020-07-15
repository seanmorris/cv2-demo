import { View as BaseView   } from 'curvature/base/View';
import { View as ArrayView  } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

import { View as EditorView } from '../Editor/View';

import * as ace from 'brace';

import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

import { Form } from 'curvature/form/Form';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const editor = this.args.editor = new EditorView;

		editor.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Form.jss')
			, mode: 'ace/mode/javascript'
		};

		editor.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		editor.args.resultTabs.output = {
			title:  'json'
			, file: 'Result JSON'
			, body: '{}'
			, mode: 'ace/mode/javascript'
			, readonly: true
		};

		editor.refreshCode();

		console.log(editor);

		const onMessage = event => {

			editor.args.resultTabs.output.body = event.data || '';

		};

		window.addEventListener('message', onMessage);

		this.onRemove(()=>{
			window.removeEventListener('message', onMessage);
		});


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
