import { View } from 'curvature/base/View';
import { RtcClient } from 'curvature/net/RtcClient';

export class JoinDemo extends View
{
	template = require('./join-demo.html');

	constructor(args, parent)
	{
		super(args, parent);

		this.args.messages = [];
		this.args.input    = '';
	}

	onAttached()
	{
		this.getClient().offer().then(token => {
			const tokenString    = JSON.stringify(token);
			const encodedToken   = `cvtp://request/${btoa(tokenString)}`;
			this.args.joinOutput = encodedToken;
		});
	}

	accept()
	{
		let answerString = this.args.input;

		const isEncoded = /^cvtp:\/\/accept\/(.+)/.exec(answerString);

		if(isEncoded)
		{
			answerString = atob(isEncoded[1]);
		}

		const answer = JSON.parse(answerString);

		this.client.accept(answer);
	}

	send(event)
	{
		if(!this.client)
		{
			return;
		}

		this.client.send(this.args.input);

		this.args.messages.push('< ' + this.args.input);

		this.args.input = '';
	}

	getClient(refresh = false)
	{
		if(this.client)
		{
			return this.client;
		}

		const rtcConfig = {
			iceServers: [
				// {urls: 'stun:stun1.l.google.com:19302'},
				// {urls: 'stun:stun2.l.google.com:19302'}
			]
		};

		const client = (!refresh && this.client) || new RtcClient(rtcConfig);

		this.client = client;

		client.addEventListener('open', event => {
			this.args.connected = true;
			this.args.input     = '';
		});

		client.addEventListener('close', event => {
			this.dispatchEvent(new CustomEvent('closed'));
			this.args.connected = false
		});

		client.addEventListener('message', event => this.args.messages.push('> ' + event.detail));

		return client;
	}

	close()
	{
		this.client.close();
		this.dispatchEvent(new CustomEvent('closed'));
	}
}
