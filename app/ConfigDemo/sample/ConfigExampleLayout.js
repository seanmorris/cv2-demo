import { View } from 'curvature/base/View';
import { Config } from 'curvature/base/Config';

export class ConfigExampleLayout extends View
{
	constructor()
	{
		super();

		this.template = require('./config-example-template.html');

		Config.init({'foo':'FOO'});
		Config.init('{"bar":"BAR"}');
		Config.set('baz', 'BAZ');

		this.args.configFoo = Config.get('foo');

		this.args.configBar = Config.get('bar');

		this.args.configBaz = Config.get('baz');
	}
}
