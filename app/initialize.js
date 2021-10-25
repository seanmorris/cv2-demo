import { Router   } from 'curvature/base/Router';
import { RuleSet  }  from 'curvature/base/RuleSet';
import { View     } from './layout/View';

import { Routes   } from './Routes';

document.addEventListener('DOMContentLoaded', () => {
	const view = new View;
	RuleSet.add('body', view);
	RuleSet.apply();
	Router.listen(view, Routes);
});
