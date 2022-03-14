import { Config } from 'curvature/base/Config';
import { Import } from 'curvature/base/Import';

import { View as BaseView } from 'curvature/base/View';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

const Legacy = require('Config');

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.args.theme = Config.get('theme');

		const sandbox = new CurvatureFrame;
		const editor  = new Editor;

		editor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'SvgExample.js'
				, label:  'SvgExample.js'
				, value:  rawquire('./sample/SvgExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'svg-example-template.svg'
				, label:  'svg-example-template.svg'
				, value:   rawquire('./sample/svg-example-template.svg')
				, type:   'application/xml'
			}
			, {
				filename: 'svg-example-initialize.js'
				, label:  'svg-example-initialize.js'
				, value:  rawquire('./sample/svg-example-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: sandbox
			}
		];

		this.args.editor  = editor;
		this.args.sandbox = sandbox;

		const sandbox2 = new CurvatureFrame;
		const editor2  = new Editor;

		editor2.addEventListener('execute', ()=>{
			sandbox2.buildPage();
		});

		editor2.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'SvgExample.js'
				, label:  'SvgExample.js'
				, value:  rawquire('./sample/SvgExample2.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'ps3-input.svg'
				, label:  'ps3-input.svg'
				, value:   rawquire('./sample/ps3-input.svg')
				, type:   'application/xml'
			}
			, {
				filename: 'svg-example-initialize.js'
				, label:  'svg-example-initialize.js'
				, value:  rawquire('./sample/svg-example-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: sandbox2
			}
		];

		this.args.editor2  = editor2;
		this.args.sandbox2 = sandbox2;
	}
}
