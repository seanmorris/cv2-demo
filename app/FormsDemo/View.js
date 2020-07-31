import { View as BaseView } from 'curvature/base/View';

import { FormEditor as EditorView } from './FormEditor';

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

		const basic = this.args.basic = new EditorView;

		basic.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Basic.jss')
			, mode: 'ace/mode/javascript'
		};

		basic.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		basic.refreshCode();

		const group = this.args.group = new EditorView;

		group.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Groups.jss')
			, mode: 'ace/mode/javascript'
		};

		group.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		group.refreshCode();

		const textField = this.args.textField = new EditorView;

		textField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/TextField.jss')
			, mode: 'ace/mode/javascript'
		};

		textField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		textField.refreshCode();

		const textareaField = this.args.textareaField = new EditorView;

		textareaField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/TextAreaField.jss')
			, mode: 'ace/mode/javascript'
		};

		textareaField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		textareaField.refreshCode();

		const fileField = this.args.fileField = new EditorView;

		fileField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/FileField.jss')
			, mode: 'ace/mode/javascript'
		};

		fileField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		fileField.refreshCode();

		const submitField = this.args.submitField = new EditorView;

		submitField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/SubmitField.jss')
			, mode: 'ace/mode/javascript'
		};

		submitField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		submitField.refreshCode();

		const buttonField = this.args.buttonField = new EditorView;

		buttonField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/ButtonField.jss')
			, mode: 'ace/mode/javascript'
		};

		buttonField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		buttonField.refreshCode();

		const checkboxField = this.args.checkboxField = new EditorView;

		checkboxField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Checkbox.jss')
			, mode: 'ace/mode/javascript'
		};

		checkboxField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		checkboxField.refreshCode();

		const selectField = this.args.selectField = new EditorView;

		selectField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/SelectField.jss')
			, mode: 'ace/mode/javascript'
		};

		selectField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		selectField.refreshCode();

		const radioField = this.args.radioField = new EditorView;

		radioField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/RadioField.jss')
			, mode: 'ace/mode/javascript'
		};

		radioField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Form.html')
			, mode: 'ace/mode/html'
		};

		radioField.refreshCode();

		const hiddenField = this.args.hiddenField = new EditorView;

		hiddenField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/HiddenField.jss')
			, mode: 'ace/mode/javascript'
		};

		hiddenField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/HiddenField.html')
			, mode: 'ace/mode/html'
		};

		hiddenField.refreshCode();

		const htmlField = this.args.htmlField = new EditorView;

		htmlField.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/HtmlField.jss')
			, mode: 'ace/mode/javascript'
		};

		htmlField.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/HtmlForm.html')
			, mode: 'ace/mode/html'
		};

		htmlField.refreshCode();

		const html5Fields = this.args.html5Fields = new EditorView;

		html5Fields.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Html5.jss')
			, mode: 'ace/mode/javascript'
		};

		html5Fields.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Html5Form.html')
			, mode: 'ace/mode/html'
		};

		html5Fields.refreshCode();
	}

	postRender()
	{

	}

	toJson(input)
	{
		return JSON.stringify(input, null, 2);
	}
}
