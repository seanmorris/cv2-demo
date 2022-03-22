import { EventPipe } from 'curvature/service/EventPipe';
import { Service } from 'curvature/service/Service';
import { Router  } from 'curvature/base/Router';
import { Uuid } from 'curvature/base/Uuid';


Service.routeHandlers.add({

	'worker-echo': (args) => 'ECHO: ' + JSON.stringify(Router.query.input)

	, 'local-events': (...args) => {

		const type = 'ServerEvent'

		let i = 0, current = 0, maxId = 100, done = false;

		const lastEventId = Router.request.headers.get('last-event-id');

		if(lastEventId)
		{
			current = 1 + Number(lastEventId);

			maxId += -1 + current;
		}

		return EventPipe({[Symbol.iterator]: () => {
			return { next() { return {
				done
				// , value: {id, type, data: new Uuid}
				, value: new Promise(accept=>{
					const id = ++current;
					if (current > maxId) {done = true}
					setTimeout(() => accept({id, type, data: new Uuid}), ++i * 100)
				})
			}}};
		}});

	}

});

Service.serviceHandlers.add({
	ping: () => 'pong!'
});


