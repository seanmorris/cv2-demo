// import { View as Editor } from '../../Editor/View';

// export class FormEditor extends Editor
// {
// 	constructor(args)
// 	{
// 		super(args);

// 		this.args.subframe = false;
// 		this.messageQueue  = [];

// 		this.args.resultTabs.output = {
// 			title:  'json'
// 			, file: 'Result JSON'
// 			, body: '{}'
// 			, mode: 'ace/mode/javascript'
// 			, readonly: true
// 		};

// 		const onMessage = event => this.onMessage(event);

// 		window.addEventListener('message', onMessage);

// 		this.onRemove(() => window.removeEventListener('message', onMessage));
// 	}

// 	frameLoaded(event)
// 	{
// 		this.args.subframe = event.target.contentWindow.frames[0];

// 		while(event = this.messageQueue.shift())
// 		{
// 			this.onMessage(event);
// 		}
// 	}

// 	onMessage(event)
// 	{
// 		if(!this.args.subframe)
// 		{
// 			this.messageQueue.push(event);

// 			return;
// 		}

// 		if(event.source === this.args.subframe)
// 		{
// 			this.args.resultTabs.output.body = event.data + "\n" || '';
// 		}
// 	}
// }
