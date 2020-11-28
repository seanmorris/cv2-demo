import { View as BaseView   } from 'curvature/base/View';
import { View as ArrayView  } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

import { View as EditorView } from '../Editor/View';

import { CurvatureFrame } from '../control/CurvatureFrame';

import { Editor   } from '../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

// import * as ace from 'brace';

// import 'brace/mode/html';
// import 'brace/mode/php';
// import 'brace/mode/javascript';
// import 'brace/theme/monokai';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const basicViewEditor = new Editor;

		basicViewEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ExampleView.js'
				, label:  'ExampleView.js'
				, value:  rawquire('./Samples/ExampleView.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/ExampleViewInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];

		this.args.basicViewEditor = basicViewEditor;

		/******/

		const scalarEditor   = new Editor;

		scalarEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ScalarExample.js'
				, label:  'ScalarExample.js'
				, value:  rawquire('./Samples/ScalarExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'scalar-template.html'
				, label:  'scalar-template.html'
				, value:  rawquire('./Samples/scalar-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/ScalarExampleInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];

		this.args.scalarEditor = scalarEditor;

		/******/


		const twoWayEditor   = new Editor;

		twoWayEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'TwoWayExample.js'
				, label:  'TwoWayExample.js'
				, value:  rawquire('./Samples/TwoWayExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'two-way-template.html'
				, label:  'two-way-template.html'
				, value:  rawquire('./Samples/two-way-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/TwoWayExampleInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];

		this.args.twoWayEditor = twoWayEditor;

		/******/

		const reverseViewEditor = new Editor;

		reverseViewEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ScalarExample.js'
				, label:  'ScalarExample.js'
				, value:  rawquire('./Samples/ScalarExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'scalar-template.html'
				, label:  'scalar-template.html'
				, value:  rawquire('./Samples/reverse-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/ScalarExampleInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];

		this.args.reverseViewEditor = reverseViewEditor;

		/******/

		const escapeViewEditor = new Editor;

		escapeViewEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'EscapeExample.js'
				, label:  'EscapeExample.js'
				, value:  rawquire('./Samples/EscapeExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'escape-template.html'
				, label:  'escape-template.html'
				, value:  rawquire('./Samples/escape-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/EscapeExampleInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];

		this.args.escapeViewEditor = escapeViewEditor;

		/******/

		const arrayViewEditor = new Editor;

		arrayViewEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ArrayExample.js'
				, label:  'ArrayExample.js'
				, value:  rawquire('./Samples/ArrayExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'array-template.html'
				, label:  'array-template.html'
				, value:  rawquire('./Samples/array-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/ArrayExampleInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];

		this.args.arrayViewEditor = arrayViewEditor;

		/******/

		const reuseViewEditor = new Editor;

		reuseViewEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ArrayExample.js'
				, label:  'ArrayExample.js'
				, value:  rawquire('./Samples/ArrayExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'array-template.html'
				, label:  'array-template.html'
				, value:  rawquire('./Samples/reuse-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/ArrayExampleInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];

		this.args.reuseViewEditor = reuseViewEditor;

		/******/

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
