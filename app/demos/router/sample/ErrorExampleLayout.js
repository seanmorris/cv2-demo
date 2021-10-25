import { View } from 'curvature/base/View';

export class ErrorExampleLayout extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.args.content = 'loading...';

		this.args.links = {
			index:      '/'
			, string:   '/string'
			, function: '/function'
			, promise:  '/promise'
			, 'failing-promise': '/error'
			, nonexistent: '/something-fake'
		};

		this.template = `<div cv-each = "links:link:label" style = "margin-bottom: 1em;">
			<span style = "margin-right: 1em;">
            	<a cv-link = "[[link]]">[[label]]</a>
            </span>
		</div>
		[[content]]`;
	}
}
