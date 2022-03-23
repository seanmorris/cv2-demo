import { View } from 'curvature/base/View';
import { EventScroller } from './EventScroller';

export class EventSourceDemo extends View
{
	template = require('./event-source-template.html');

	constructor(args,parent)
	{
		super(args,parent);

		this.args.items = [];
	}

	onAttached()
	{
		this.args.localEvents = new EventScroller({
			changedScroll: 2
			, rowHeight: 30
			, header: true
		});

		this.localSource = new EventSource('/local-events');

		this.args.localEvents.args.content = [
			{type:'type', id:'id', data:'payload'}
		];

		this.localSource.addEventListener('ServerEvent', event => {

			const payload = JSON.parse(event.data);

			this.args.localEvents.args.content.push({
				id: '0x' + Number(event.lastEventId).toString(16)
				, type: event.type
				, data: event.data
			});

			this.args.localEvents.updateViewport();

			if(payload.id >= 1_000_000)
			{
				this.localSource.close();
			}

		});

		this.onRemove(() => this.localSource.close());

		this.args.cloudEvents = new EventScroller({
			changedScroll: 2
			, rowHeight: 30
			, header: true
		});

		this.cloudSource = new EventSource('https://curvature.seanmorr.is/streaming-events');

		this.args.cloudEvents.args.content = [
			{type:'type', id:'id', data:'payload'}
		];

		this.cloudSource.addEventListener('ServerEvent', event => {

			const payload = JSON.parse(event.data);

			this.args.cloudEvents.args.content.push({
				id: '0x' + Number(event.lastEventId).toString(16)
				, type: event.type
				, data: event.data
			});

			this.args.cloudEvents.updateViewport();

			if(payload.id >= 1_000_000)
			{
				this.cloudSource.close();
			}

		});

		this.onRemove(() => this.cloudSource.close());
	}
}
