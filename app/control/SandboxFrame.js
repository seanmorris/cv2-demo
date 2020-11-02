import { View } from 'curvature/base/View';
import { Tag  } from 'curvature/base/Tag';

export class SandboxFrame extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./sandboxFrame');

		this.args.source = 'Hello, world!';

		this.args.csp = this.args.csp || {

			'default-src': [
				`${location.origin}/curvature.js`
				, `${location.origin}/vendor.js`
				, `'unsafe-inline'`
			]

			, 'connect-src': [
				`https://api.dictionaryapi.dev`
				, `ws://${location.hostname}:9485`
			]
		};
	}

	attached()
	{
		const cspTag = new Tag(`<meta http-equiv = "Content-Security-Policy">`);

		this.args.csp.bindTo((v,k,t,d) => {
			const content = Object.keys(this.args.csp).map(
				v => `${v} ${this.args.csp[v].join(' ')}`
			).join('; ');

			cspTag.attr({content});
		});

		this.tags.sandbox.contentDocument.head.append(cspTag.node);

		const frameTag = new Tag(`<iframe sandbox = "allow-scripts"/>`);

		this.args.bindTo('source', v => frameTag.attr({'srcdoc': v}));

		frameTag.style({
			position: 'absolute'
			, top:    0
			, bottom: 0
			, left:   0
			, right:  0
			, border: 0
		});

		this.tags.sandbox.contentDocument.body.append(frameTag.node);
	}

	frameLoaded()
	{

	}
}
