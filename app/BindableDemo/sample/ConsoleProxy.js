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
