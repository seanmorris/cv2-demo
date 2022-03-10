import { View } from 'curvature/base/View';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

export class LocalHttpDemo extends View
{
	template = require('./local-http-demo.html');

	constructor(args,parent)
	{
		super(args,parent);

		const editor = this.args.editor = new Editor;

		const allFiles = {filename: '*', label:  '*'};

		const source = {
			filename: 'service-worker.js'
			, label:  'service-worker.js'
			, value:  rawquire('../../notify-service.js')
			, type:   'application/javascript'
		};

		editor.args.files  = [allFiles, source];
	}
}
