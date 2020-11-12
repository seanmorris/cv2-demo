import { Bindable } from 'curvature/base/Bindable';
import { View as BaseView } from 'curvature/base/View';

import { Keyboard } from 'curvature/input/Keyboard';

import { Keyboard as KeyboardView } from './Keyboard'
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

		Keyboard.get().codes.bindTo((v,k,t,d) => {

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
		});

		this.onFrame(()=>Keyboard.get().update());
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
}
