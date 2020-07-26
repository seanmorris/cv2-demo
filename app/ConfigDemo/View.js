import { Config } from 'curvature/base/Config';
import { Import } from 'curvature/base/Import';

import { View as BaseView } from 'curvature/base/View';

import { View as Editor } from '../Editor/View';

const Legacy = require('Config');

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.args.theme = Config.get('theme');

		console.log(Legacy);

		const editor = new Editor;

		editor.args.tabs.js = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Config.jss')
			, mode: 'ace/mode/javascript'
		};

		editor.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/template.html')
			, mode: 'ace/mode/html'
		};

		editor.refreshCode();

		this.args.editor = editor;
	}
}
