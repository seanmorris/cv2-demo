import { Bag } from 'curvature/base/Bag';
import { View } from 'curvature/base/View';
import { Gamepad } from 'curvature/input/Gamepad'

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

import { GamepadView } from './GamepadView';
import { Sequence } from 'curvature/input/Sequence';

import { SequenceView } from '../../control/SequenceView';

export class GamepadDemo extends View
{
	template = require('./template.html');

	constructor(args, parent)
	{
		super(args, parent);

		this.args.pads = [];

		const gamepadEditor  = this.args.gamepadEditor  = new Editor;
		const sequenceEditor = this.args.sequenceEditor = new Editor;

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

		const gamepadView = {
			filename: 'GamePadView.js'
			, label:  'gamepad/GamePadView.js'
			, value:  rawquire('./GamepadView.js')
			, type:   'application/javascript'
		};

		const gamepadTemplate = {
			filename: 'gamepad.html'
			, label:  'gamepad/gamepad.html'
			, value:  rawquire('./gamepad.html')
			, type:   'text/html'
		};

		const sequenceView = {
			filename: 'SequenceView.js'
			, label:  '../../control/SequenceView.js'
			, value:  rawquire('../../control/SequenceView.js')
			, type:   'application/javascript'
		};

		const sequenceTemplate = {
			filename: 'sequence.html'
			, label:  '../../control/sequence.html'
			, value:  rawquire('../../control/sequence.html')
			, type:   'text/html'
		};

		gamepadEditor.args.files  = [allFiles, mainSource, mainTemplateSource, gamepadView, gamepadTemplate];
		sequenceEditor.args.files = [allFiles, sequenceView, sequenceTemplate];

		this.pads = new Bag;

		this.args.pads = this.pads.map(pad => new GamepadView({pad}, this));

		const deadZone = 0.00;

		[...Array(4)].forEach((_,index) => Gamepad.getPad({index, deadZone}).then(
			pad => this.pads.add(pad)
		));

		const konami = [
			'Button12'
			, 'Button12'
			, 'Button13'
			, 'Button13'
			, 'Button14'
			, 'Button15'
			, 'Button14'
			, 'Button15'
			, 'Button1'
			, 'Button0'
			, 'Button9'
		];

		const konamiSeq = new Sequence({ keys: konami, timing: 750 });

		this.args.konami1 = new SequenceView({
			sequence: konamiSeq
			, title:  'Konami Code'
		});

		const sonic = [
			'Button12'
			, 'Button12'
			, 'Button13'
			, 'Button13'
			, 'Button12'
			, 'Button12'
			, 'Button12'
			, 'Button12'
		];

		const sonicSeq = new Sequence({ keys: sonic, timing: 750 });

		this.args.sonic  = new SequenceView({
			sequence: sonicSeq
			, title:  'Sonic 3 Level Select'
		});

		this.onFrame(()=>{

			for(const pad of this.pads.items())
			{
				pad.update();

				for(const b in pad.buttons)
				{
					if(pad.buttons[b].active && pad.buttons[b].time === 1)
					{
						sonicSeq.check(`Button${b}`);
						konamiSeq.check(`Button${b}`);
					}
				}
			}

		});

		konamiSeq.addEventListener('complete', event => {
			if(this.matchTimer)
			{
				clearTimeout(this.matchTimer);
			}

			this.args.match = 'matching';
		});

		konamiSeq.addEventListener('advance', event => {
			if(this.matchTimer)
			{
				clearTimeout(this.matchTimer);
			}
			this.args.matches = event.detail.matched;
			this.args.match = 'partial';
			this.matchTimer = this.onTimeout(
				konamiSeq.timing
				, () => this.args.match = ''
			)
		});

		konamiSeq.addEventListener('cancel', event => {
			if(this.matchTimer)
			{
				clearTimeout(this.matchTimer);
			}
			this.args.matches = event.detail.matched;
			this.args.match = 'no-match';
		});
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

