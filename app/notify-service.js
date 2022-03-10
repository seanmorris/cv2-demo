importScripts( "/curvature.js" );

import { Service } from 'curvature/service/Service';
import { Router  } from 'curvature/base/Router';

Service.serviceHandlers.add({
	routes: {
		'worker-echo': (args) => JSON.stringify(Router.query.input)
	}
});
