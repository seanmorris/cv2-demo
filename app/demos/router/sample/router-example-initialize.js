import { View    } from 'curvature/base/View';
import { Router  } from 'curvature/base/Router';
import { RuleSet } from 'curvature/base/RuleSet';

import { RouterExampleLayout } from './RouterExampleLayout';

const layout = new RouterExampleLayout;

layout.render(document.body);

const InternalError = Router.InternalError;
const NotFoundError = Router.NotFoundError;

class RouteHandler extends View
{
	template = 'This page comes from a view class.'
}

Router.listen(layout, {

	'': class extends View{
		template = '<p>This is the index page.</p><hr /><p>The current date and time is [[time]].<p>';
		onAttached(){ this.onFrame(()=>this.args.time = String(new Date)) }
	}

	, 'this-page-is-a-string': 'This page is just a string!'

	, 'this-one-comes-from-a-function': () => 'This page is the result of a callback!'

	, 'this-one-comes-from-a-class': RouteHandler

	, 'and-this-one-comes-from-a-promise': () => new Promise((accept, reject) => {
		layout.args.content = 'loading...';
		setTimeout(()=>accept('This page is generated by a promise!'), 500);
	})

	, 'this-promise-fails': () => new Promise((accept, reject) => {
		layout.args.content = 'loading...';
		setTimeout(()=> reject('The promise rejected with this message.'), 500);
	})

	, 'throw-fake-error': () => new Promise((accept, reject) => {
		throw new Error('Fake internal error!');
	})

	, [NotFoundError]: '404 - Page not found!'
	, [InternalError]: ({[InternalError]:error}) => View.from(`<small>Error Caught</small><pre>${error.stack ?? error}</pre>`)

});
