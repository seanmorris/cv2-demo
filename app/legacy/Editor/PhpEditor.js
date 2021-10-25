import { Php } from 'php-wasm/Php';
import { View as Editor } from '../Editor/View';

export class PhpEditor extends Editor
{
	constructor(args)
	{
		super(args);

		this.args.subframe = false;
		this.messageQueue  = [];

		const onMessage = event => this.onMessage(event);

		window.addEventListener('message', onMessage);

		this.onRemove(() => window.removeEventListener('message', onMessage));

		const php = new Php();

		php.addEventListener('ready', (event) => {

		});

		php.addEventListener('output', (event) => {

			if(!event.detail)
			{
				return;
			}

			const frame = this.tags.result.element;
			const doc   = frame.contentWindow.document;

			doc.write(event.detail.join(''));
		});

		this.php = php;

		this.onRemove(() => this.php = false);
	}

	refreshCode(event)
	{
		this.rendered.then(()=>{

			const phpCode = this.args.tabs.php.body;

			const frame = this.tags.result.element;
			const doc   = frame.contentWindow.document;

			doc.body.innerHTML = '';

			this.php.run(phpCode);

			this.args.editorStatus  = `Last ran at ${(new Date).toISOString()}`
			this.args.editorRefresh = 'refresh-disabled';

		});
	}
}
