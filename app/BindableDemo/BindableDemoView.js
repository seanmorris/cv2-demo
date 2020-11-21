import { View } from 'curvature/base/View';

import { GeoIn  } from 'curvature/animate/ease/GeoIn';
import { GeoOut } from 'curvature/animate/ease/GeoOut';

import { CubicIn  } from 'curvature/animate/ease/CubicIn';
import { CubicOut } from 'curvature/animate/ease/CubicOut';

import { CurvatureFrame } from '../control/CurvatureFrame';
import { FakeConsole } from '../control/FakeConsole';

import { Editor   } from '../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

export class BindableDemoView extends View
{
	constructor(args = {}, parent)
	{
		super(args, parent);

		this.template  = require('./bindable-demo');

		const bindingSandbox  = new CurvatureFrame;
		const bindingEditor   = new Editor;

		bindingSandbox.editor = bindingEditor;

		const bindingOutput = new FakeConsole;

		bindingEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'WatchExample.js'
				, label:  'WatchExample.js'
				, value:  rawquire('./sample/WatchExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'console'
				, label:  'console'
				, control: bindingOutput
			}
		];

		this.args.bindingSandbox = bindingSandbox;
		this.args.bindingEditor  = bindingEditor;

		bindingEditor.addEventListener('execute', ()=>{
			bindingSandbox.buildPage();
		});

		const debindingSandbox  = new CurvatureFrame;
		const debindingEditor   = new Editor;

		// debindingSandbox.editor = debindingEditor;

		const debindingOutput = new FakeConsole;

		debindingEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'WatchExample.js'
				, label:  'WatchExample.js'
				, value:  rawquire('./sample/WatchExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'console'
				, label:  'console'
				, control: debindingOutput
			}
		];

		this.args.debindingSandbox = debindingSandbox;
		this.args.debindingEditor  = debindingEditor;

		debindingEditor.addEventListener('execute', ()=>{
			debindingSandbox.buildPage();
		});
	}

	onAttach()
	{
		// this.editor.args()
	}
}
