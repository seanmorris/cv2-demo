import { EventPipe } from 'curvature/service/EventPipe';
import { Service } from 'curvature/service/Service';
import { Router  } from 'curvature/base/Router';
import { Uuid } from 'curvature/base/Uuid';


Service.routeHandlers.add({

	'omnifeed': (args) => {

		const type = 'OmniRecord';

		let i = 0, current = 0, maxId = 100, done = false;

		const lastEventId = Router.request.headers.get('last-event-id');

		if(lastEventId)
		{
			current = 1 + Number(lastEventId);

			maxId += -1 + current;
		}

		return EventPipe({[Symbol.iterator]: () => {
			return { next() { return {
				done, value: new Promise(accept=>{
					const id = ++current;
					if (current > maxId) {done = true}

					const packet = 'data:application/json,'
						+ JSON.stringify({time:Date.now(), frame: new Uuid});

					setTimeout(() => accept({id, type, data:packet}), ++i * 100)
				})
			}}};
		}});
	}

});
