import { Config } from 'curvature/base/Config';
import { Cookie } from 'curvature/base/Cookie';

import { View as BaseView } from 'curvature/base/View';

import { Tag } from 'curvature/base/Tag';
import CodeMirror from 'codemirror';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';

import { rawquire } from 'rawquire/rawquire.macro';

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

	postRender()
	{
		const jsTextbox = new Tag(`<textarea>`);

		const jsEditor = CodeMirror(jsTextbox, {
			theme:        'elegant'
			, autoRefresh: true
			, mode:        'javascript'
		});

		jsEditor.setValue(rawquire('./View.js'));

		this.onNextFrame(()=> jsEditor.refresh());

		this.args.jsEditor = jsEditor.display.wrapper;

		const htmlTextbox = new Tag(`<textarea>`);

		const htmlEditor = CodeMirror(jsTextbox, {
			theme:        'elegant'
			, autoRefresh: true
			, mode:        'htmlmixed'
		});

		htmlEditor.setValue(rawquire('./template.html'));

		this.onNextFrame(()=> htmlEditor.refresh());

		this.args.htmlEditor = htmlEditor.display.wrapper;
	}

	click(event, cookieName)
	{
		Cookie.set(cookieName, (0xFFFFFF * Math.random()).toString(36));
	}

	get(event, cookieName, output)
	{
		this.args[output] = Cookie.get(cookieName);
	}

	del(event, cookieName)
	{
		Cookie.delete(cookieName);
	}
}
