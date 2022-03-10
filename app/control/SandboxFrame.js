import { View } from 'curvature/base/View';
import { Tag  } from 'curvature/base/Tag';

export class SandboxFrame extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.args.source  = '';

		this.messageQueue = [];
		this.template     = require('./sandboxFrame');

		this.args.csp = this.args.csp || {
			'script-src': [
				'https://unpkg.com/@babel/standalone@7.12.6/babel.js'
				, `${location.origin}/vendor.js`
				, `${location.origin}/curvature.js`
				, `'unsafe-inline'`
				, `'unsafe-eval'`
			]
			, 'connect-src': [
				`ws://${location.hostname}:9485`
				, 'https://random.imagecdn.app'
				, 'https://images.unsplash.com'
				, 'https://unpkg.com'
			]
		};

		this.frameTag = false;
		this.debind   = false;
		this.cspTag   = false;
	}

	onRendered(event)
	{
		if(this.hasAttached)
		{
			return;
		}

		this.hasAttached = true;

		this.listen(window, 'message', event => this.onMessage(event));

		this.tags.sandbox.addEventListener('load', event => this.handleSandboxLoaded(event));
	}

	handleSandboxLoaded(event)
	{
		this.cspTag   && this.cspTag.remove();
		this.frameTag && this.frameTag.remove();
		this.debind   && this.debind();

		const cspTag = new Tag(`<meta http-equiv = "Content-Security-Policy"/>`);

		this.args.csp.bindTo((v,k,t,d) => {
			const content = Object.keys(this.args.csp)
				.map(v => `${v} ${this.args.csp[v].join(' ')}`)
				.join('; ');

			cspTag.attr({content});
		});

		const frameTag = new Tag(`<iframe sandbox = "allow-scripts allow-popups" />`);
		const frameDoc = this.tags.sandbox.node.contentDocument;

		frameDoc.head.append(cspTag.node);
		frameDoc.body.append(frameTag.node);
		frameTag.style({
			position: 'absolute'
			, width:  '100%'
			, height: '100%'
			, top:    0
			, left:   0
			, border: 0
		});

		this.tags.sandbox.style({
			position: 'absolute'
			, width:  '100%'
			, height: '100%'
			, top:    0
			, left:   0
			, border: 0
		});

		this.frameTag = frameTag;
		this.cspTag   = cspTag;

		this.listen(frameTag, 'load', event => this.onFrameLoaded(event));

		this.debind = this.args.bindTo('source', v => {
			this.onTimeout(0, () => {
				frameTag.attr({'srcdoc': v})
			});
		});
	}

	onFrameLoaded(event)
	{
		this.subFrame = event.target.contentWindow;

		while(event = this.messageQueue.shift())
		{
			this.onMessage(event);
		}

		this.dispatchEvent(new CustomEvent('SandboxLoaded', {detail: { view: this }}));
	}

	onMessage(event)
	{
		if(!this.subFrame)
		{
			this.messageQueue.push(event);
			return;
		}

		if(event.source !== this.subFrame)
		{
			return;
		}

		this.dispatchEvent(new CustomEvent('SandboxMessage', {detail: {
			view: this, data: event.data
		}}));

		// const message = JSON.parse(event.data);
		// const type    = message.shift()
		// const items   = message.map(i => JSON.stringify(i)).join(', ');

		// this.args.lines.push({type, items});
	}
}
