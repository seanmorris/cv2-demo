import { Router   } from 'curvature/base/Router';
import { RuleSet }  from 'curvature/base/RuleSet';
import { View } from './Layout/View';

document.addEventListener('DOMContentLoaded', () => {
	const view = new View;
	RuleSet.add('body', view);
	RuleSet.apply();
	Router.listen(view);
});
