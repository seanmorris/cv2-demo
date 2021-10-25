import { Config } from 'curvature/base/Config';
import { Import } from 'curvature/base/Import';

import { View as BaseView } from 'curvature/base/View';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

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
				filename: 'Countdown.js'
				, label:  'Countdown.js'
				, value:  rawquire('./sample/Countdown.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'MixinExample.js'
				, label:  'MixinExample.js'
				, value:  rawquire('./sample/MixinExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'mixin-example-template.html'
				, label:  'mixin-example-template.html'
				, value:   rawquire('./sample/mixin-example-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'mixin-example-initialize.js'
				, label:  'mixin-example-initialize.js'
				, value:  rawquire('./sample/mixin-example-initialize.js')
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

		editor.addEventListener('execute', ()=>{
			sandbox.buildPage();
		});
	}
}
