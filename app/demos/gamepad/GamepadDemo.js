import { View } from 'curvature/base/View';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

import { GamepadView } from './GamepadView';

export class GamepadDemo extends View
{
	template = require('./template.html');

	constructor(args, parent)
	{
		super(args, parent);

		this.listen(window, 'gamepadconnected', event => this.padConnected(event))

		this.args.pads = [];

		const editor  = this.args.editor = new Editor;

		const allFiles = {filename: '*', label:  '*'};

		const viewSource = {
			filename: 'View.js'
			, label:  'matrix/View.js'
			, value:  rawquire('./GamepadView.js')
			, type:   'application/javascript'
		};

		const templateSource = {
			filename: 'template.html'
			, label:  'matrix/template.html'
			, value:  rawquire('./gamepad.html')
			, type:   'text/html'
		};

		editor.args.files = [allFiles, viewSource, templateSource];
	}

	onAttached()
	{
		const l = ()=> { this.loop(); requestAnimationFrame(l); };

		requestAnimationFrame(l);
	}

	padConnected(event)
	{
		const pad  = event.gamepad;

		const view = new GamepadView({pad}, this);

		this.args.pads[ pad.index ] = view;
	}

	loop()
	{
		const pads = navigator.getGamepads();
		const del  = [];

		for(let i = 0; i < pads.length; i++)
		{
			if(!this.args.pads[i])
			{
				this.args.pads.splice(i);
				continue;
			}

			if(!pads[i])
			{
				del.push(i);
				continue;
			}

			const padView = this.args.pads[i];

			padView.onLoop(pads[i]);
		}

		for(let i in del.reverse())
		{
			// delete this.args.pads[ del[i] ];
		}

		// {
		// 	const pad = pads[i];

		// 	if(!pad)
		// 	{
		// 		continue;
		// 	}

		// 	this.args.lx = pad.axes[0];
		// 	this.args.ly = pad.axes[1];
		// 	this.args.rx = pad.axes[2];
		// 	this.args.ry = pad.axes[3];

		// 	for(let ii = 0; ii < pad.buttons.length; ii++)
		// 	{
		// 		const button = pad.buttons[ii];

		// 		this.args['b' + ii] = button.value > this.args['b' + ii]
		// 			? button.value
		// 			: this.args['b' + ii];
		// 	}
		// }
	}
}

