const View = require('curvature/base/View').View;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		this.ruleSet.add('custom-tag', tag => {

			const div = document.createElement('div');
			const element = tag.element;

			while(element.firstChild)
			{
				div.append('The tag that contained "');
				div.append(element.firstChild);
				div.append('" has been replaced with this div tag.');
			}

			return div;

		});
	}
}
