import { View as BaseView } from 'curvature/base/View';

import { View as ArrayView } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

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

		this.args.showJs     = true;
		this.args.showHtml   = true;
		this.args.showResult = true;

		this.args.twoWay = 'Two way binding!';

		this.args.twoWayHtml = `<button cv-on = "click:clear('twoWay')">X</button>
<input cv-bind = "twoWay"><br />[[twoWay]]`;

		this.args.twoWayJs = require('./Samples/TwoWay');

		this.args.list = ['Milk','Eggs','Bread'];

		this.args.time = 'k.';

		this.refreshCode();

		this.args.time = (new Date).toISOString();

		this.onFrame(() => {

			this.args.time = (new Date).toISOString();

		});

		this.args.showClasses = ['showHtml', 'showResult'];
	}

	stringToDataUrl(input, type = 'text/plain')
	{
		return `data:${type};base64,${btoa(input)}`;
	}

	showTabBody(...tabs)
	{
		this.args.showClasses = tabs;

		this.args.showJs     = false;
		this.args.showHtml   = false;
		this.args.showResult = false;

		for(const tab of tabs)
		{
			this.args[tab] = true;
		}

		this.editor.resize();
		this.editorJs.resize();
	}

	postRender()
	{
		const html = this.tags.twoWayHtml.element;
		const js   = this.tags.twoWayJs.element;

		const editorJs = ace.edit(js);

		editorJs.session.setMode('ace/mode/javascript');
		editorJs.setTheme('ace/theme/monokai');
		editorJs.setOptions({
			autoScrollEditorIntoView: true
			, printMargin: false
		});

		this.editorJs = editorJs;

		const editor = ace.edit(html);

		editor.session.setMode('ace/mode/html');
		editor.setTheme('ace/theme/monokai');
		editor.setOptions({
			autoScrollEditorIntoView: true
			, printMargin: false
		});

		this.editor = editor;

		this.editor.resize();
		this.editorJs.resize();

		this.editor.session.on('change', () => {
			this.args.editorStatus = `The code has been updated at ${(new Date).toISOString()}`
			this.args.editorRefresh = 'refresh-enabled';
		});
		this.editorJs.session.on('change', () => {
			this.args.editorStatus = `The code has been updated at ${(new Date).toISOString()}`
			this.args.editorRefresh = 'refresh-enabled';
		});

		console.log(html);
	}

	refreshCode(event)
	{
		if(this.editor)
		{
			this.args.twoWayHtml = this.editor.getValue();
		}

		if(this.editorJs)
		{
			this.args.twoWayJs = this.editorJs.getValue();
		}

		let resultTemplate = require('./Samples/document.html');

		resultTemplate =resultTemplate.replace(
			/\[ORIGIN\]/g, location.origin
		);

		resultTemplate =resultTemplate.replace(
			/\[SCRIPT\]/g, this.args.twoWayJs
		);

		resultTemplate =resultTemplate.replace(
			/\[TEMPLATE\]/g, this.args.twoWayHtml
		);

		this.args.frameSource = this.stringToDataUrl(resultTemplate, 'text/html');

		this.args.editorStatus  = `Refreshed at ${(new Date).toISOString()}`
		this.args.editorRefresh = 'refresh-disabled';
	}

	addItalicTags(input)
	{
		return `<i>${input}</i>`;
	}

	toJson(input)
	{
		return JSON.stringify(input);
	}

	reverseString(input = '')
	{
		return input.split('').reverse().join('');
	}

	clear(clearVar)
	{
		this.args[clearVar] = '';
	}

	joinClass(input)
	{
		return (input || []).join(' ');
	}
}
