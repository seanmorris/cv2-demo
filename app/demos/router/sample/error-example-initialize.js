import { View    } from 'curvature/base/View';
import { Router  } from 'curvature/base/Router';
import { RuleSet } from 'curvature/base/RuleSet';

import { ErrorExampleLayout } from './ErrorExampleLayout';

const layout = new ErrorExampleLayout;

const NotFoundError = Router.NotFoundError;
const InternalError = Router.InternalError;

layout.render(document.body);

Router.listen(layout, {

	'': class extends View{
		template = '<p>This is the index page.</p><hr /><p>The current date and time is [[time]].<p>';
		onAttached(){ this.onFrame(()=>this.args.time = String(new Date)) }
	}

	, [NotFoundError]: '404 - Page not found!'

	, [InternalError]: ({[InternalError]:error}) => {

		return View.from(`<small>Error Caught</small><pre>${error.stack}</pre>`);

	}

	, 'even-numbers/%number': ({number}) => {
		if(number % 2)
		{
			return false;
		}

		return `Your even number is ${number}.`;
	}

	, 'this-route-throws-errors/*': ({pathparts}) => new Promise((accept, reject) => {

		throw new Error(pathparts.length
			? `Something happened ${pathparts.join(' ')}.`
			: 'Something happened.'
		);

	})


});
