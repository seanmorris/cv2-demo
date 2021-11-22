import { Bag } from 'curvature/base/Bag';
import { View } from 'curvature/base/View';
import { Gamepad } from 'curvature/input/Gamepad'

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

		this.args.pads = [];

		const editor  = this.args.editor = new Editor;

		const allFiles = {filename: '*', label:  '*'};

		const mainSource = {
			filename: 'GamepadDemo.js'
			, label:  'gamepad/GamepadDemo.js'
			, value:  rawquire('./GamepadDemo.js')
			, type:   'application/javascript'
		};

		const mainTemplateSource = {
			filename: 'template.html'
			, label:  'gamepad/template.html'
			, value:  rawquire('./template.html')
			, type:   'text/html'
		};

		const viewSource = {
			filename: 'View.js'
			, label:  'gamepad/View.js'
			, value:  rawquire('./GamepadView.js')
			, type:   'application/javascript'
		};

		const templateSource = {
			filename: 'template.html'
			, label:  'gamepad/template.html'
			, value:  rawquire('./gamepad.html')
			, type:   'text/html'
		};

		editor.args.files = [allFiles, mainSource, mainTemplateSource, viewSource, templateSource];

		this.pads = new Bag;

		this.args.pads = this.pads.map(pad => new GamepadView({pad}, this));

		const deadZone = 0.00;

		[...Array(4)].forEach((_,index) => Gamepad.getPad({index, deadZone}).then(
			pad => this.pads.add(pad)
		));
	}

	onAttached()
	{
		const l = ()=> { this.loop(); requestAnimationFrame(l); };

		requestAnimationFrame(l);
	}

	loop()
	{
		for(const pad of this.pads.list)
		{
			pad.readInput();
		}

		for(const padView of this.args.pads.list)
		{
			padView.onLoop();
		}
	}
}

