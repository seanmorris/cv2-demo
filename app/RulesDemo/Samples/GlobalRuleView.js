const RuleSet = require('curvature/base/RuleSet').RuleSet;
const View    = require('curvature/base/View').View;
const Tip     = Symbol();

RuleSet.add('define', tag => {
	const final = document.createElement('span');
	const word  = tag.element.innerText;

	final.style.display = 'content';
	final.style.cursor  = 'help';

	final.style.borderBottom = '1px purple solid';

	final.setAttribute('tabindex', '-1');

	const url = `https://api.dictionaryapi.dev/api/v1/entries/en/${word}`;

	final.onclick = () => {

		if(final[Tip])
		{
			final[Tip].remove();

			delete final[Tip];
		}

		const tip = document.createElement('div');

		tip.innerText = '&nbsp;';

		tip.style.pointerEvents = 'none';

		tip.style.border     = '1px #ccc solid';
		tip.style.fontSize   = '0.5em';
		tip.style.padding    = '0.25em';
		tip.style.minWidth   = '1em';
		tip.style.maxWidth   = '15em';
		tip.style.position   = 'absolute';
		tip.style.background = 'white';
		tip.style.left       = `${event.pageX}px`;
		tip.style.top        = `${event.pageY}px`;

		final[Tip] = tip;

		const loader = setInterval(
			() => tip.innerText = '.'.repeat(1 + e++ % 3)
			, 250
		);

		final.append(tip);

		let e = 0;

		fetch(url).then(r=>r.json()).then(r=>{

			clearInterval(loader);

			if(!r || !r[0] || !r[0].meaning)
			{
				tip.innerText = 'Definition Not found.';
				return;
			}

			const defs = Object.values(r[0].meaning)[0];

			if(!defs || !defs[0] || !defs[0].definition)
			{
				tip.innerText = 'Definition Not found.';
				return;
			}

			tip.innerText = defs[0].definition;
		});
	};

	final.onblur  = () => {

		if(!final[Tip])
		{
			return;
		}

		const tip = final[Tip];

		tip.remove();

		delete final[Tip];

	};

	return final;
});

export class GlobalRuleView extends View
{
	constructor()
	{
		super();

		this.template = require('./global-rules-example.html');
	}
}
