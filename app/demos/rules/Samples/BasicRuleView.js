import { View } from 'curvature/base/View';

export class BasicRuleView extends View
{
	constructor()
	{
		super();

		this.template = require('./basic-rules-example.html');

		this.ruleSet.add('textarea,input[maxlength]', tag => {

			const element = tag.element;
			const parent  = element.parentNode;

			const max = element.getAttribute('maxlength');
			const bar = document.createElement('progress');
			const ind = document.createElement('p');

			const length = element.value.length;

			ind.innerText = `${length} / ${max}`;

			bar.setAttribute('max', max);
			bar.setAttribute('value', length);

			element.addEventListener('input', event => {

				const length = event.target.value.length;

				bar.setAttribute('value', length);

				ind.innerText = `${length} / ${max}`;

			});

			const next = element.nextSibling;

			parent.insertBefore(bar, next);
			parent.insertBefore(ind, next);
		});
	}
}
