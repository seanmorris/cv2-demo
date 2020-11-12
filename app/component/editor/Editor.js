import { View as BaseView } from 'curvature/base/View';

import { Keyboard } from 'curvature/input/Keyboard';

import { SandboxFrame } from '../../control/SandboxFrame';
import { CodeEditor   } from '../../control/CodeEditor';
import { RadioBar     } from '../../control/RadioBar';

import CodeMirror from 'codemirror';

import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';

import { rawquire } from 'rawquire/rawquire.macro';

export class Editor extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent)

		this.template = require('./editor');
		this.args.orientation = 'horizontal';

		this.args.buttons   = [];
		this.args.radioBar  = new RadioBar;
		this.args.floating  = false;
		this.args.changed   = true;
		// this.args.status    = `Code updated at ${(new Date).toISOString()}.`;
		this.args.status    = ``;
		this.args.showField = `*`;

		this.args.bindTo('files', v => {

			const radioBarArgs = this.args.radioBar.args;

			if(!v)
			{
				radioBarArgs.buttons = [];
				return;
			}

			for(const i in v)
			{
				const file     = v[i];
				const callback = () => this.showField(file.label);
				const label    = file.filename;

				if(!file.editor && file.value)
				{
					file.editor  = new CodeEditor({value: file.value, mode: file.type});
					file.control = file.editor;
				}

				if(file.editor && (
					!radioBarArgs.buttons[i]
					|| file !== radioBarArgs.buttons[i].file
				)){
					file.editor.args.bindTo('value', v =>{
						this.args.changed = true;
						this.args.status  = '';
						this.onTimeout(10, () => this.args.status = this.args.status = `Code updated at ${(new Date).toISOString()}.`);
					});
				}

				radioBarArgs.buttons[i] = {label, callback, file};
			}

			radioBarArgs.buttons.length = v.length;

		}, {children: true});
	}

	postRender()
	{
		this.onRemove(Keyboard.get().keys.bindTo('Control', v => {
			this.multi = v > 0;

			this.args.multiselect = this.multi
				? 'multiselect'
				: 'select';
		}));

		this.args.selected = this.args.selected || 0;
	}

	showField(name)
	{
		const fields    = this.findTags('[data-field]');
		const showField = this.findTag(`[data-field="${name}"]`);

		if(name !== '*')
		{
			for(const field of fields)
			{
				field.style.display = 'none';
			}
		}
		else
		{
			for(const field of fields)
			{
				field.style.display = '';
			}

			this.args.showField = name;

			return;
		}


		if(showField)
		{
			showField.style.display = '';
		}

		this.args.showField = name;
	}

	changeOrientation()
	{
		this.args.orientation = this.args.orientation == 'horizontal'
			? 'vertical'
			: 'horizontal';
	}

	expand(event)
	{
		this.args.expanded = this.args.expanded
			? ''
			: 'expanded';

		if(this.args.expanded)
		{
			document.body.classList.add('no-scroll');

		}
		else
		{
			document.body.classList.remove('no-scroll');
		}
	}
}
