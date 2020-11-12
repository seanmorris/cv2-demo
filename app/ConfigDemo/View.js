import { Config } from 'curvature/base/Config';
import { Import } from 'curvature/base/Import';

import { CurvatureFrame } from '../control/CurvatureFrame';

import { View as BaseView } from 'curvature/base/View';

import { Editor } from '../component/editor/Editor';

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

		sandbox.editor = editor;

		editor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ConfigExampleLayout.js'
				, label:  'ConfigExampleLayout.js'
				, value:  rawquire('./sample/ConfigExampleLayout.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'config-example-template.html'
				, label:  'config-example-template.html'
				, value:   rawquire('./sample/config-example-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'config-example-initialize.js'
				, label:  'config-example-initialize.js'
				, value:  rawquire('./sample/config-example-initialize.js')
				, type:   'application/javascript'

			}
			// , {
			// 	filename: 'result'
			// 	, label:  'result'
			// 	, control: sandbox
			// }
		];

		this.args.editor  = editor;
		this.args.sandbox = sandbox;

		editor.addEventListener('execute', ()=>{
			sandbox.buildPage();
		});
	}
}
