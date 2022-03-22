import { View     } from 'curvature/base/View';
import { Service  } from 'curvature/service/Service';
import { rawquire } from 'rawquire/rawquire.macro';
import { Editor   } from '../../component/editor/Editor';

import { FakeConsole } from '../../control/FakeConsole';

export class InteropDemo extends View
{
	template = require('./interop-demo.html');

	constructor(args, parent)
	{
		super(args, parent);

		const editor = this.args.editor = new Editor;

		this.args.fakeConsole = new FakeConsole;

		const demoHandler = {
			handleBroadcast: event => this.handleBroadcast(event)
			, handleMessage: event => this.handleMessage(event)
		};

		Service.pageHandlers.add(demoHandler);

		const konsole = window.console;

		window.console = new Proxy(console, { get: (t,k) => {
			if(typeof t[k] !== 'function')
			{
				return t[k];
			}

			return (...args) => {
				const type  = k;
				const items = args.map(i => JSON.stringify(i, null, 4)).join(",\n");

				this.args.fakeConsole.args.lines.push({type, items});

				return t[k](...args);
			};
		}});

		this.onRemove(() => Service.pageHandlers.delete(demoHandler));

		Service.request({echo: 'Connected', broadcast: true});

		const disconnected = () => Service.request({echo: 'Disonnected', broadcast: true});

		this.onRemove(disconnected);

		this.listen(window, 'unload', disconnected);
	}

	send(event)
	{
		console.log('Sending \'ping!\' from page.');

		Service.request({command: 'ping', broadcast: true})
		.then(response => console.log('Got \'' + response + '\' from worker.'));
	}

	handleMessage(event)
	{
		if(event.data.echo)
		{
			console.log(`Got '${event.data.echo}' from ${event.data.source}.`);
			return;
		}

		// console.log(event.data);
	}

	handleBroadcast(event)
	{
		if(event.data.echo)
		{
			console.log(`Got '${event.data.echo}' from ${event.data.source}.`);
			return;
		}

		if(event.data.command !== 'ping')
		{
			return;
		}

		console.log(`Responding to ping from ${event.data.source}.`);

		const packet = {echo: `pong!`, to: event.data.source};

		Service.request(packet)
		.then(response => console.log('Got \'' + response + '\'.'));
	}
}
