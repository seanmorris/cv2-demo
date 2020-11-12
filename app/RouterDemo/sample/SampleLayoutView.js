import { View } from 'curvature/base/View';

export class SampleLayoutView extends View
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

		this.template =
		`<ul cv-each = "links:link:label">
			<li><a cv-link = "[[link]]">[[label]]</a></li>
		</ul>
		[[content]]`;
	}
}
