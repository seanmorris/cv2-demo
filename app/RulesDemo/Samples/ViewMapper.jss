const View = require('curvature/base/View').View;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		this.ruleSet.add('[data-class]', Clock);

		const clock = new Clock();

		this.ruleSet.add('[data-object]', clock);
	}
}

class Clock extends View
{
	constructor()
	{
		super();

		this.template = `
			<p><progress max = "24"   value = "[[h]]"></progress>[[h]]</p>
			<p><progress max = "60"   value = "[[m]]"></progress>[[m]]</p>
			<p><progress max = "60"   value = "[[s]]"></progress>[[s]]</p>
			<p><progress max = "1000" value = "[[n]]"></progress>[[n]]</p>
		`;

		this.onFrame(() => {

			const d = new Date();

			this.args.h = d.getHours();
			this.args.m = d.getMinutes();
			this.args.s = d.getSeconds();
			this.args.n = d.getMilliseconds();

		});
	}
}
