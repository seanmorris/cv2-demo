import { View as BaseView } from 'curvature/base/View';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

import { MatrixDatabase } from './MatrixDatabase';
import { MatrixEvent } from './MatrixEvent';
import { Matrix } from 'matrix-api/Matrix';

export class View extends BaseView
{
	template = rawquire('./template.html');

	constructor(args,parent)
	{
		super(args,parent);

		this.args.loggedIn = false;

		const editor  = this.args.editor = new Editor;

		const allFiles = {filename: '*', label:  '*'};

		const viewSource = {
			filename: 'View.js'
			, label:  'matrix/View.js'
			, value:  rawquire('./View.js')
			, type:   'application/javascript'
		};

		const templateSource = {
			filename: 'template.html'
			, label:  'matrix/template.html'
			, value:  rawquire('./template.html')
			, type:   'text/html'
		};

		editor.args.files = [allFiles, viewSource, templateSource];

		this.args.messages = [];

		this.args.roomId = '!gThNCOwMwODTVUMrTe:matrix.org';
		this.args.input  = '';

		this.matrix = new Matrix;
	}

	login()
	{
		this.matrix.addEventListener('logged-in', event => {
			this.args.loggedIn = true;
		});

		this.matrix.initSso(location.origin + '/accept-sso');

		this.matrix.addEventListener('logged-in', event => {

			console.log('Logged in!', event);

			this.matrix.joinRoom(this.args.roomId);

			this.matrix.addEventListener('m.room.message', event => {

				if(event.detail.room_id !== this.args.roomId)
				{
					return;
				}

				this.args.messages.push(event.detail);
			});

			this.matrix.listenForServerEvents();

			this.sync();

		}, {once: true});
	}

	send(event)
	{
		if(event.key && event.key !== 'Enter')
		{
			return;
		}

		this.matrix.putEvent(
			this.args.roomId
			, 'm.room.message'
			, {msgtype: 'm.text', body: this.args.input}
		)
		.then(response => this.args.input = '')
		.catch(error => console.error(error));
	}

	closeConnection(event)
	{
		console.log(event);
	}

	sync()
	{
		MatrixDatabase.open('events', 1).then(database => {
			this.matrix.sync().then(syncStart => {

				if(!syncStart || !syncStart.rooms || !syncStart.rooms.join)
				{
					return;
				}

				return Object.entries(syncStart.rooms.join);

			}).then(rooms => rooms.forEach(([room,state]) => {

				if(room !== this.args.roomId)
				{
					return;
				}

				if(!state || !state.timeline)
				{
					return;
				}

				if(!state.timeline.prev_batch)
				{
					return;
				}

				const lowWater = localStorage.getItem('room-lowWater::' + room);

				this.matrix.addEventListener('roomSyncFrame', event => {

					const frame = event.detail.frame;

					localStorage.setItem('matrix-api::room-lowWater::' + room, frame.end)

					frame.chunk.forEach(chunk => {
						const event = MatrixEvent.from(chunk);

						const store = 'events';
						const index = 'event_id';
						const range = event.event_id;
						const type  = MatrixEvent;

						const query = {store, index, range, type};

						database.select(query).one().then(res => {
							if(res.index)
							{
								res.result.consume(chunk);

								database.update('events', res.result);
							}
							else
							{
								database.insert('events', event);
							}
						});
					});

				});

				this.matrix
				.syncRoomHistory(room, lowWater || state.timeline.prev_batch)
				.then(() => {
					if(state.timeline.events)
					{
						state.timeline.events.forEach(chunk => {
							chunk.room_id = room;

							const event = MatrixEvent.from(chunk);

							const store = 'events';
							const index = 'event_id';
							const range = event.event_id;
							const type  = MatrixEvent;

							database.select({store, index, range, type}).one().then(res => {

								if(res.index)
								{
									res.result.consume(chunk);

									database.update('events', res.result);
								}
								else
								{
									database.insert('events', event).catch(error => console.warn(error));
								}
							});
						});
					}
				});
			}));
		});
	}
}
