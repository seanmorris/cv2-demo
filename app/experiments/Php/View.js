import { View as BaseView } from 'curvature/base/View';

import { SandboxFrame } from '../../control/SandboxFrame';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

import { Php } from 'php-wasm/Php';

// import { PhpEditor } from '../../Editor/PhpEditor';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const sandbox = new SandboxFrame;
		const editor = this.args.editor = new Editor;

		const php = new Php();

		php.addEventListener('ready', (event) => {

		});

		this.onRemove(() => this.php = false);

		editor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'phpinfo.php'
				, label:  'phpinfo.php'
				, value:  require('./phpinfo.php')
				, type:   'php'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: sandbox
			}
		];

		php.addEventListener('output', (event) => {

			if(!event.detail)
			{
				return;
			}

			sandbox.args.source += event.detail.join('');
		});

		editor.addEventListener('execute', ()=>{
			sandbox.args.source = '';
			php.run(editor.args.files[1].control.args.value);
		});
	}
}
