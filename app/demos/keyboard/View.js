import { Bindable } from 'curvature/base/Bindable';
import { View as BaseView } from 'curvature/base/View';

import { Keyboard } from 'curvature/input/Keyboard';
import { Sequence } from 'curvature/input/Sequence';
import { Keyboard as KeyboardView } from './Keyboard'

import { SequenceView } from './SequenceView';
import { CursorKeys } from './CursorKeys'
import { Numpad } from './Numpad'

export class View extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./template');

		this.classes = Bindable.makeBindable({});

		this.classes.bindTo(
			(v,k) => this.args.classes = Object.assign({}, this.classes)
			, {frame: 1}
		);

		this.args.whichs = {};
		this.args.codes  = {};
		this.args.keys   = {};

		this.args.cursorKeys = new CursorKeys;
		this.args.keyboard   = new KeyboardView;
		this.args.numpad     = new Numpad;

		Keyboard.get().focusElement = false;

		this.args.bindTo('listening', v => {
			Keyboard.get().listening = v;
		});

		this.onRemove(()=>Keyboard.get().listening = false);

		this.args.listening = true;

		Keyboard.get().codes.bindTo(this.keycodeChanged.bind(this));

		this.onFrame(()=>Keyboard.get().update());

		document.body.focus();

		const konami = [
			'ArrowUp'
			, 'ArrowUp'
			, 'ArrowDown'
			, 'ArrowDown'
			, 'ArrowLeft'
			, 'ArrowRight'
			, 'ArrowLeft'
			, 'ArrowRight'
			, 'KeyB'
			, 'KeyA'
			, 'Enter'
		];

		const konamiSeq = new Sequence({ keys: konami, timing: 750 });

		const konamiAlt = [
			'ArrowUp'
			, 'ArrowUp'
			, 'ArrowDown'
			, 'ArrowDown'
			, 'ArrowLeft'
			, 'ArrowRight'
			, 'ArrowLeft'
			, 'ArrowRight'
			, 'KeyB'
			, 'KeyA'
			, 'Space'
		];

		const konamiAltSeq = new Sequence({ keys: konamiAlt, timing: 750 });

		const doom = [
			'KeyI'
			, 'KeyD'
			, 'KeyC'
			, 'KeyL'
			, 'KeyI'
			, 'KeyP'
		];

		const doomSeq = new Sequence({ keys: doom, timing: 750 });

		const sonic = [
			'ArrowUp'
			, 'ArrowUp'
			, 'ArrowDown'
			, 'ArrowDown'
			, 'ArrowUp'
			, 'ArrowUp'
			, 'ArrowUp'
			, 'ArrowUp'
		];

		const sonicSeq = new Sequence({ keys: sonic, timing: 750 });

		this.args.konami1 = new SequenceView({
			sequence: konamiSeq
			, title:  'Konami Code'
		});

		this.args.konami2 = new SequenceView({
			sequence: konamiAltSeq
			, title:  'Konami Code (alt)'
		});

		this.args.sonic  = new SequenceView({
			sequence: sonicSeq
			, title:  'Sonic 3 Level Select'
		});

		this.args.doom2 = new SequenceView({
			sequence: doomSeq
			, title:  'Doom 2 NoClip Mode'
		});

		this.sequences = [ konamiSeq, konamiAltSeq, doomSeq, sonicSeq ];
	}

	join(x)
	{
		if(!x)
		{
			return;
		}

		return Object
			.keys(x)
			.filter(k => x[k])
			.join(' ');
	}

	keycodeChanged(v,k,t,d)
	{
		const key = Keyboard.get().getKeyRef(k);

		if(d)
		{
			this.args.cursorKeys.args[k] = '';
			this.args.keyboard.args[k]   = '';
			this.args.numpad.args[k]     = '';

			return;
		}

		this.args.cursorKeys.args[k] = v > 0 ? 'pressed' : 'released';
		this.args.keyboard.args[k]   = v > 0 ? 'pressed' : 'released';
		this.args.numpad.args[k]     = v > 0 ? 'pressed' : 'released';

		if(v === -1)
		{
			this.sequences.forEach(seq => seq.check(k));
		}

	}
}
