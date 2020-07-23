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

		this.php = new Php();

		console.log(this.php);

		this.php.addEventListener('output', (event) => {

			if(!event.detail)
			{
				return;
			}

			const frame = this.tags.result.element;
			const doc   = frame.contentWindow.document;

			doc.write(event.detail.join(''));
		});
	}

	refreshCode(event)
	{
		console.log(this.php, this.args.tabs.php);

		if(!this.php)
		{
			return;
		}

		if(!this.args.tabs.php)
		{
			return;
		}

		const phpCode = this.args.tabs.php.body;

		if(!this.tags.result)
		{
			return;
		}

		const frame = this.tags.result.element;
		const doc   = frame.contentWindow.document;

		doc.body.innerHTML = '';

		this.php.run(phpCode);

		this.args.editorStatus  = `Last ran at ${(new Date).toISOString()}`
		this.args.editorRefresh = 'refresh-disabled';
	}
}
