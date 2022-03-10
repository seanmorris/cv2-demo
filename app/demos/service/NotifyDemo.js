import { View } from 'curvature/base/View';
import { FakeConsole } from '../../control/FakeConsole';
import { Service  } from 'curvature/service/Service';

import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

export class NotifyDemo extends View
{
	template = rawquire('./notify-demo.html');

	constructor(args, parent)
	{
		super(args, parent);

		this.args.notifyTitle = "Note #" + Math.random()
		this.args.notifyBody  = "notification " + Date.now();
		this.args.notifyIcon  = 'http://placekitten.com/800/800';
		this.args.notifyTag   = 'view-a-kitten';

		this.args.notifyRequireInteract = true;
		this.args.notifyBroadcast       = false;

		this.args.fakeConsole = new FakeConsole;

		const konsole = console;

		window.console = new Proxy(console, { get: (t,k) => {
			if(typeof t[k] !== 'function')
			{
				return t[k];
			}

			return (...args) => {
				const type    = k;
				const items   = args.map(i => JSON.stringify(i, null, 4)).join(",\n");

				this.args.fakeConsole.args.lines.push({type, items});

				return t[k](...args);
			};
		}});

		this.onRemove(() => window.console = konsole);

		const editor = this.args.editor = new Editor;

		const allFiles = {filename: '*', label:  '*'};

		const workerSource = {
			filename: 'notify-service.js'
			, label:  'notify-service.js'
			, value:  rawquire('../../notify-service.js')
			, type:   'application/javascript'
		};

		const initSource = {
			filename: 'initialize.js'
			, label:  'initialize.js'
			, value:  rawquire('../../initialize.js')
			, type:   'application/javascript'
		};

		const demoSource = {
			filename: 'NotifyDemo.js'
			, label:  'NotifyDemo.js'
			, value:  rawquire('./NotifyDemo.js')
			, type:   'application/javascript'
		};

		const demoTemplate = {
			filename: 'notify-demo.html'
			, label:  'notify-demo.html'
			, value:  rawquire('./notify-demo.html')
			, type:   'text/html'
		};

		editor.args.files = [allFiles, initSource, workerSource, demoSource, demoTemplate];
	}

	notify()
	{
		const title   = this.args.notifyTitle;
		const text    = this.args.notifyBody;
		const options = {
			body: text
			, icon: this.args.notifyIcon
			, tag:  this.args.notifyTag
			, data:  {test:1234}
			, actions: [
				{title: 'yes',  action: 'y'}
				, {title: 'no', action: 'n'}
			]
			, timestamp: Date.now()
			, requireInteraction: this.args.notifyRequireInteract
			// , silent: false
		};

		Service.notify(title, options, this.args.notifyBroadcast)
		.then(notify => console.log(notify));
	}
}
