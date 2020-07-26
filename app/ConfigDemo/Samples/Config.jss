const View   = require('curvature/base/View').View;
const Config = require('curvature/base/Config').Config;
const TopLvl = require('Config').Config;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		Config.init({'foo':'FOO'});
		Config.init('{"bar":"BAR"}');
		Config.set('baz', 'BAZ');
		TopLvl.quz = 'QUZ';

		this.args.configFoo = Config.get('foo');
		this.args.topLvlFoo = TopLvl.foo;

		this.args.configBar = Config.get('bar');
		this.args.topLvlBar = TopLvl.bar;

		this.args.configBaz = Config.get('baz');
		this.args.topLvlBaz = TopLvl.baz;

		this.args.configQuz = Config.get('quz');
		this.args.topLvlQuz = TopLvl.quz;
	}

	toJson(input = '')
	{
		return JSON.stringify(input);
	}
}
