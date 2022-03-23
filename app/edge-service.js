import { CloudService } from 'curvature/service/CloudService';
import { Router  } from 'curvature/base/Router';

CloudService.routeHandlers.add({
	ping: () => 'pong!'
	, 'worker-echo': (...args) => JSON.stringify(Router.query.input)
	, 'streaming-events': (...args) => {

		const headers = new Headers;

		headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		headers.set('Access-Control-Allow-Origin',  '*');

		headers.set('Cache-Control', 'no-cache');
		headers.set('Content-Type',  'text/event-stream');
		headers.set('Connection',    'keep-alive');

		const { readable, writable } = new TransformStream();

		const writer  = writable.getWriter();
		const encoder = new TextEncoder();

		const events = Object.keys(Array(100).fill()).map(id => ({id}));
		const type   = 'ServerEvent';
		let   id     = 0;
		const emit   = (line,accept) => {

			const now  = Date.now();
			line.time  = now;
			const data = JSON.stringify(line)

			writer.write(encoder.encode(
				`event: ${ type }\n`
				+ `data: ${ data }\n`
				+ `id: ${ now }\n\n`
			));

			accept();
		};

		const emits = events.map((line, l) => new Promise(
			accept => setTimeout(() => emit(line, accept), l * 100)
		));

		Promise.all(emits).then(() => writer.close());

		return new Response(readable, {
			status:       '200'
			, statusText: 'OK'
			, headers
		});
	}
});
