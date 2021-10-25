import { View as BaseView } from 'curvature/base/View';

import CodeMirror from 'codemirror';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { rawquire } from 'rawquire/rawquire.macro';

import { Editor } from '../../component/editor/Editor';

import { Config } from 'curvature/base/Config';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./template');

		const basicSandbox = new CurvatureFrame;
		const basicEditor = new Editor;

		basicEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'TypeX.js'
				, label:  'TypeX.js'
				, value:  rawquire('./sample/TypeX.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'TypeY.js'
				, label:  'TypeY.js'
				, value:  rawquire('./sample/TypeY.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'TypeZ.js'
				, label:  'TypeZ.js'
				, value:  rawquire('./sample/TypeZ.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'ViewX.js'
				, label:  'ViewX.js'
				, value:  rawquire('./sample/ViewX.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'ViewY.js'
				, label:  'ViewY.js'
				, value:  rawquire('./sample/ViewY.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'ViewZ.js'
				, label:  'ViewZ.js'
				, value:  rawquire('./sample/ViewZ.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'templateX.html'
				, label:  'templateX.html'
				, value:  rawquire('./sample/templateX.html')
				, type:   'text/html'
				, hide:   true
			}
			, {
				filename: 'templateY.html'
				, label:  'templateY.html'
				, value:  rawquire('./sample/templateY.html')
				, type:   'text/html'
				, hide:   true
			}
			, {
				filename: 'templateZ.html'
				, label:  'templateZ.html'
				, value:  rawquire('./sample/templateZ.html')
				, type:   'text/html'
				, hide:   true
			}
			, {
				filename: 'TypeZAlpha.js'
				, label:  'TypeZAlpha.js'
				, value:  rawquire('./sample/TypeZAlpha.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'ViewZAlpha.js'
				, label:  'ViewZAlpha.js'
				, value:  rawquire('./sample/ViewZAlpha.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'templateZAlpha.html'
				, label:  'templateZAlpha.html'
				, value:  rawquire('./sample/templateZAlpha.html')
				, type:   'text/html'
				, hide:   true
			}
			, {
				filename: 'XyzTheme.js'
				, label:  'XyzTheme.js'
				, value:  rawquire('./sample/XyzTheme.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'ThemeExample.js'
				, label:  'ThemeExample.js'
				, value:  rawquire('./sample/ThemeExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'theme-example-template.html'
				, label:  'theme-example-template.html'
				, value:   rawquire('./sample/theme-example-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: basicSandbox
			}
			, {
				filename: 'theme-initialize.js'
				, label:  'theme-initialize.js'
				, value:  rawquire('./sample/theme-example-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
		];

		this.args.basicEditor  = basicEditor;
		this.args.basicSandbox = basicSandbox;

		basicEditor.addEventListener('execute', ()=>{
			basicSandbox.buildPage();
		});

		const typeSandbox = new CurvatureFrame;
		const typeEditor = new Editor;

		typeEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'TypeX.js'
				, label:  'TypeX.js'
				, value:  rawquire('./sample/TypeX.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'TypeY.js'
				, label:  'TypeY.js'
				, value:  rawquire('./sample/TypeY.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'TypeZ.js'
				, label:  'TypeZ.js'
				, value:  rawquire('./sample/TypeZ.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'TypeZAlpha.js'
				, label:  'TypeZAlpha.js'
				, value:  rawquire('./sample/TypeZAlpha.js')
				, type:   'application/javascript'
			}
		];

		typeEditor.addEventListener('execute', event => basicEditor.buildPage());

		typeEditor.addEventListener('input', event => {
			const filename = event.detail.file.filename;
			for(const file of basicEditor.args.files)
			{
				if(file.filename !== filename)
				{
					continue;
				}

				if(!file.editor)
				{
					return;
				}

				file.editor.args.value = event.detail.value;
			}
		});

		this.args.typeEditor = typeEditor;
		this.args.typeEditor = typeEditor;

		typeEditor.buildPage();

		const viewSandbox = new CurvatureFrame;
		const viewEditor = new Editor;

		viewEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ViewX.js'
				, label:  'ViewX.js'
				, value:  rawquire('./sample/ViewX.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'ViewY.js'
				, label:  'ViewY.js'
				, value:  rawquire('./sample/ViewY.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'ViewZ.js'
				, label:  'ViewZ.js'
				, value:  rawquire('./sample/ViewZ.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'ViewZAlpha.js'
				, label:  'ViewZAlpha.js'
				, value:  rawquire('./sample/ViewZAlpha.js')
				, type:   'application/javascript'
			}
		];

		this.args.viewEditor = viewEditor;
		this.args.viewEditor = viewEditor;

		viewEditor.addEventListener('execute', event => basicEditor.buildPage());

		viewEditor.addEventListener('input', event => {
			const filename = event.detail.file.filename;
			for(const file of basicEditor.args.files)
			{
				if(file.filename !== filename)
				{
					continue;
				}

				if(!file.editor)
				{
					return;
				}

				file.editor.args.value = event.detail.value;
			}
		});

		viewEditor.buildPage();

		const templateSandbox = new CurvatureFrame;
		const templateEditor = new Editor;

		templateEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'templateX.html'
				, label:  'templateX.html'
				, value:  rawquire('./sample/templateX.html')
				, type:   'text/html'
			}
			, {
				filename: 'templateY.html'
				, label:  'templateY.html'
				, value:  rawquire('./sample/templateY.html')
				, type:   'text/html'
			}
			, {
				filename: 'templateZ.html'
				, label:  'templateZ.html'
				, value:  rawquire('./sample/templateZ.html')
				, type:   'text/html'
			}
			, {
				filename: 'templateZAlpha.html'
				, label:  'templateZAlpha.html'
				, value:  rawquire('./sample/templateZAlpha.html')
				, type:   'text/html'
			}
		];

		templateEditor.addEventListener('execute', event => basicEditor.buildPage());

		templateEditor.addEventListener('input', event => {
			const filename = event.detail.file.filename;
			for(const file of basicEditor.args.files)
			{
				if(file.filename !== filename)
				{
					continue;
				}

				if(!file.editor)
				{
					file.value = event.detail.value;
					return;
				}

				file.editor.args.value = event.detail.value;
			}
		});

		this.args.templateEditor = templateEditor;
		this.args.templateEditor = templateEditor;

		templateEditor.buildPage();
	}
}
