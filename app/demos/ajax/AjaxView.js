import { View } from 'curvature/base/View';
import { Elicit } from 'curvature/net/Elicit';

import { CurvatureFrame } from '../../control/CurvatureFrame';

import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

export class AjaxView extends View
{
	template = require('./ajax-template.html');

	constructor(args, parent)
	{
		super(args, parent);

		const editor = new Editor;

		this.args.editor = editor;

		editor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ProgressExample.js'
				, label:  'ProgressExample.js'
				, value:  rawquire('./samples/ProgressExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'progress-example.html'
				, label:  'progress-example.html'
				, value:  rawquire('./samples/progress-example.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./samples/ProgressInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: new CurvatureFrame
			}
		];
	}
}
