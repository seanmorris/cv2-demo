import { Bindable } from 'curvature/base/Bindable';

const console = new Proxy(console, {
	get: (t,k) => {

		if(typeof t[k] === 'function')
		{
			return (...args) => {

				window.parent.parent.postMessage(JSON.stringify([k, ...args]), '*');

				return t[k](...args);
			};
		}

		return t[k];
	}
});

class Foobar {};

const foo = Bindable.make( new Foobar );

foo.x = 0;

foo.bindTo('x', v => console.log(v));

foo.x = 1;
foo.x = 2;
foo.x = 3;
