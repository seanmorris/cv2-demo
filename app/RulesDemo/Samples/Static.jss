const RuleSet = require('curvature/base/RuleSet').RuleSet;
const View    = require('curvature/base/View').View;

RuleSet.add('p', tag => {
	tag.element.innerText = 'Global rule applied!';
});

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');
	}
}
