import { Config } from 'curvature/base/Config';
import { Cookie } from 'curvature/base/Cookie';

import { View as BaseView } from 'curvature/base/View';

const Legacy = require('Config');

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		Cookie.jar.bindTo('test-cookie-a', v => {
			this.args.testCookieA = v || '';
		});

		Cookie.jar.bindTo('test-cookie-b', v => {
			this.args.testCookieB = v || '';
		});

		Cookie.jar.bindTo('test-cookie-c', v => {
			this.args.testCookieC = v || '';
		});
	}

	click(event, cookieName)
	{
		Cookie.set(cookieName, (0xFFFFFF * Math.random()).toString(36));
	}

	get(event, cookieName, output)
	{
		this.args[output] = Cookie.get(
			cookieName
			, (0xFFFFFF * Math.random()).toString(36)
		);
	}

	del(event, cookieName)
	{
		Cookie.delete(cookieName);
	}
}
