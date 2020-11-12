import { View as BaseView } from 'curvature/base/View';

import { SandboxFrame } from '../control/SandboxFrame';

import { rawquire } from 'rawquire/rawquire.macro';

import { Editor } from '../component/editor/Editor';

export class View extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent)

		this.template = require('./template');
	}

	onAttached()
	{
		this.buildPage();
	}

	onRendered()
	{
		const sandbox = new SandboxFrame;

		this.sandbox = sandbox;

		this.args.editor = new Editor({},this);

		this.args.editor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'SampleLayoutView.js'
				, value:   rawquire('./sample/SampleLayoutView.js')
				, type:   'application/javascript'
				, label:  'SampleLayoutView'
			}
			, {
				filename: 'sample-initialize.js'
				, value:   rawquire('./sample/sample-initialize.js')
				, type:   'application/javascript'
				, label:  'sample-initialize'
			}
			, {
				filename:  'result.html'
				, control: sandbox
				, label:   'result'
			}
		];
	}

	buildPage()
	{
		const sampleHtml = (
			'<'+'html><'+'head>'
				+ '<'+`script >const exports = {};<`+'/script>'
				+ '<'+'script src="https://unpkg.com/@babel/standalone@7.12.6/babel.js"><'+'/script>'
				+ '<'+`script src="${location.origin}/vendor.js"><`+'/script>'
				+ '<'+`script src="${location.origin}/curvature.js"><`+'/script>'
				+ this.args.editor.args.files
					.filter(file=>file.type === 'text/html')
					.map(file=>`<`
						+`script type = "text/babel" data-presets = "es2015" data-module = "${file.filename}">`
						+ `require.register('./'+${JSON.stringify(file.filename)}, (_exports, require, module) => module.exports = ${JSON.stringify(file.editor.args.value)});`
						+ `<` + `/script>`)
					.join('')
				+ '<'+'/script>'
				+ this.args.editor.args.files
					.filter(file=>file.type === 'application/javascript')
					.map(file=>`<`+`script type = "text/babel" data-presets = "es2015" data-module = "${file.filename.replace(/\..+/,'')}">`
						+ file.editor.args.value + `;`
						+ `require.register('./'+${JSON.stringify(file.filename.replace(/\..+/,''))}, (_exports, require, module) => _exports[${JSON.stringify(file.filename.replace(/\..+/,''))}] = exports[${JSON.stringify(file.filename.replace(/\..+/,''))}])`
						+ `<`+`/script>`
					)
					.join('')
				+ this.args.editor.args.files
					.filter(file=>file.type === 'text/css')
					.map(file=>`<`+`style type = "${file.type}">${file.editor.args.value}<`+`/style>`)
					.join('')
				+ this.args.editor.args.files
					.filter(file=>file.type === 'application/json')
					.map(file=>`<`+`script type = "${file.type}" data-values = "${file.filename.replace(/\..*/, '')}">${file.editor.args.value}<`+`/script>`)
					.join('')
				+ '<'+'/head><'+'body></'+'body>'
				+ '<'+'/html>'
		);


		this.sandbox.args.source = sampleHtml;

		this.args.editor.args.changed = false;
		this.args.editor.args.status  = '';
		this.onTimeout(100, () => this.args.editor.args.status = `Code evaluated at ${(new Date).toISOString()}.`);
	}
}
