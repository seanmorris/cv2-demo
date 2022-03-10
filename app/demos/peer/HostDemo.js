import { View } from 'curvature/base/View';
import { RtcServer } from 'curvature/net/RtcServer';

export class HostDemo extends View
{
	template = require('./host-demo.html');

	constructor(args, parent)
	{
		super(args, parent);

		this.args.messages = [];
		this.args.input    = '';
	}

	answer()
	{
		let offerString = this.args.input;

		const isEncoded = /^cvtp:\/\/request\/(.+)/.exec(offerString);

		if(isEncoded)
		{
			offerString = atob(isEncoded[1]);
		}

		const offer = JSON.parse(offerString);

		const answer = this.getServer().answer(offer);

		answer.then(token => {
			const tokenString    = JSON.stringify(token);
			const encodedToken   = `cvtp://accept/${btoa(tokenString)}`;
			this.args.hostOutput = encodedToken;
		});

		return answer;
	}

	send(event)
	{
		if(!this.server)
		{
			return;
		}

		this.server.send(this.args.input);

		this.args.messages.push('< ' + this.args.input);

		this.args.input = '';
	}

	getServer(refresh = false)
	{
		if(this.server)
		{
			return this.server;
		}

		const rtcConfig = {
			iceServers: [
				// {urls: 'stun:stun1.l.google.com:19302'},
				// {urls: 'stun:stun2.l.google.com:19302'}
			]
		};

		const server = (!refresh && server) || new RtcServer(rtcConfig);

		this.server = server;

		server.addEventListener('open', event => {
			this.args.connected = true;
			this.args.input     = '';
		});

		server.addEventListener('close', event => {
			this.dispatchEvent(new CustomEvent('closed'));
			this.args.connected = false
		});
		server.addEventListener('message', event => this.args.messages.push('> ' +event.detail));

		return server;
	}

	close()
	{
		this.server.close();
		this.dispatchEvent(new CustomEvent('closed'));
	}
}
