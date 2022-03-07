import { View    } from 'curvature/base/View';
import { Router  } from 'curvature/base/Router';

import { WildcardExampleLayout } from './WildcardExampleLayout';

const layout = new WildcardExampleLayout;

layout.render(document.body);

Router.listen(layout, {
	'': class extends View{
		template = '<p>This is the index page.</p><hr /><p>The current date and time is [[time]].<p>';
		onAttached(){ this.onFrame(()=>this.args.time = String(new Date)) }
	}

	// Replament tokens:
	, 'page/%id': ({id}) => `Page ${id} selected.`

	// Optional tokens:
	, 'optional/%x?': ({x}) => `Option ${x ? '' : 'not'} provided.`

	// Variadic tokens
	, 'variadic/*': ({pathparts}) => {

		if(!pathparts.length)
		{
			return 'Nothing provided.';
		}

		return `${pathparts.join(', ')} provided.`;
	}

	, [Router.NotFoundError]: '404 - Page not found!'
});
