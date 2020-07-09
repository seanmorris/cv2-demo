import { View as BaseView   } from 'curvature/base/View';
import { View as ArrayView  } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

import { View as EditorView } from '../Editor/View';

import * as ace from 'brace';

import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.editors  = {};

		this.args.twoWay = 'Two way binding!';

		this.args.twoWayHtml = `<button cv-on = "click:clear('twoWay')">X</button>
<input cv-bind = "twoWay"><br />[[twoWay]]`;

		this.args.twoWayJs = require('./Samples/TwoWay');

		this.args.list = ['Milk','Eggs','Bread'];

		this.args.time = 'k.';

		this.args.time = (new Date).toISOString();

		this.onFrame(() => {

			this.args.time = (new Date).toISOString();

		});

		const editor = this.args.editor = new EditorView;

		editor.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Scalar.jss')
			, mode: 'ace/mode/javascript'
		};

		editor.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Scalar.html')
			, mode: 'ace/mode/html'
		};

		editor.refreshCode();

		const editorTwoWay = this.args.editorTwoWay = new EditorView;

		editorTwoWay.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/TwoWay.jss')
			, mode: 'ace/mode/javascript'
		};

		editorTwoWay.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/TwoWay.html')
			, mode: 'ace/mode/html'
		};

		editorTwoWay.refreshCode();

		const editorReverse = this.args.editorReverse = new EditorView;

		editorReverse.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Scalar.jss')
			, mode: 'ace/mode/javascript'
		};

		editorReverse.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Reverse.html')
			, mode: 'ace/mode/html'
		};

		editorReverse.refreshCode();

		const editorEscape = this.args.editorEscape = new EditorView;

		editorEscape.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Scalar.jss')
			, mode: 'ace/mode/javascript'
		};

		editorEscape.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Escape.html')
			, mode: 'ace/mode/html'
		};

		editorEscape.refreshCode();

		const editorArray = this.args.editorArray = new EditorView;

		editorArray.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Array.jss')
			, mode: 'ace/mode/javascript'
		};

		editorArray.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Array.html')
			, mode: 'ace/mode/html'
		};

		editorArray.refreshCode();

		const editorJson = this.args.editorJson = new EditorView;

		editorJson.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Array.jss')
			, mode: 'ace/mode/javascript'
		};

		editorJson.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/ArrayJson.html')
			, mode: 'ace/mode/html'
		};

		editorJson.refreshCode();

		const editorReuse = this.args.editorReuse = new EditorView;

		editorReuse.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Array.jss')
			, mode: 'ace/mode/javascript'
		};

		editorReuse.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Reuse.html')
			, mode: 'ace/mode/html'
		};

		editorReuse.refreshCode();
	}

	addItalicTags(input)
	{
		return `<i>${input}</i>`;
	}

	reverseString(input = '')
	{
		return input.split('').reverse().join('');
	}

	clear(clearVar)
	{
		this.args[clearVar] = '';
	}
}