import { View as BaseView } from 'curvature/base/View';

import { PhpEditor } from '../../Editor/PhpEditor';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const editor = this.args.editor = new PhpEditor;

		editor.args.tabs.php = {
			title:  'php'
			, file: 'HelloWorld.php'
			, body: require('./phpinfo.php')
			, mode: 'ace/mode/php'
		};

		this.onNextFrame(()=>editor.refreshCode());
	}
}
