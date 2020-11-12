import { View } from 'curvature/base/View';
import { Tag  } from 'curvature/base/Tag';

export class SandboxFrame extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./sandboxFrame');

		this.args.source = '';

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
				, 'https://unpkg.com'
			]
		};

		this.frameTag = false;
		this.debind   = false;
		this.cspTag   = false;
	}

	onAttached()
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

		const frameDoc = this.tags.sandbox.contentDocument;

		frameDoc.head.append(cspTag.node);

		const frameTag = new Tag(`<iframe sandbox = "allow-scripts"/>`);

		this.debind = this.args.bindTo('source', v => frameTag.attr({'srcdoc': v}));

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
	}

	frameLoaded()
	{
		this.dispatchEvent(new CustomEvent('SandboxLoaded', {
			detail: { view: this }
		}));
	}
}
