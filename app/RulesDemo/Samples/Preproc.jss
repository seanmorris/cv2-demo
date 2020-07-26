const View = require('curvature/base/View').View;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		const selector = 'h1,p';

		const nodes = [];
		const index = new WeakMap();

		const nodeIndex = (node) => {

			if(index[node] !== undefined)
			{
				return index[node];
			}

			index[node] = nodes.length;
			nodes.push(node);

			return index[node];
		};

		this.preRuleSet.add(selector, tag => {

			const element  = tag.element;
			const view     = tag.parent;
			const parent   = element.parentNode;
			const tagIndex = nodeIndex(element);
			const refName  = `node_${ tagIndex }`;

			element.setAttribute('tabindex', -1);

			const input = document.createElement('input');

			input.setAttribute('cv-bind', refName);
			element.setAttribute('cv-bind', refName);

			view.args[refName] = element.innerText;

			element.addEventListener('focus', () => {
				input.style.display = '';
				input.focus();
				input.select();
			});

			input.addEventListener('blur', () => {
				input.style.display = 'none';
			});

			parent.insertBefore(input, element.nextSibling);
			input.style.display = 'none';
		});
	}
}
