import { View as BaseView } from 'curvature/base/View';
import { Bindable } from 'curvature/base/Bindable';

import { Keyboard } from 'curvature/input/Keyboard';

import { CodeEditor   } from '../../control/CodeEditor';
import { RadioBar     } from '../../control/RadioBar';

import CodeMirror from 'codemirror';

import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/php/php';
import 'codemirror/mode/htmlmixed/htmlmixed';

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
		this.args.throttled = false;
		// this.args.status    = `Code updated at ${(new Date).toISOString()}.`;
		this.args.status    = ``;
		this.args.showField = ``;

		this.init = false;
	}

	onRendered()
	{
		// this.onVisible();return;

		const observer = new IntersectionObserver(
			entries => entries.forEach(entry => {
				if(entry.isIntersecting && !this.init)
				{
					this.init = true;
					this.onVisible();
					observer.unobserve(this.tags.editor.node);
				}
			})
		);

		observer.observe(this.tags.editor.node);

		this.onRemove(() => {
			observer.unobserve(this.tags.editor.node);
		});
	}

	onVisible()
	{
		this.args.bindTo('files', v => {

			const radioBarArgs = this.args.radioBar.args;

			if(!v)
			{
				radioBarArgs.buttons = [];
				return;
			}

			for(const i in v)
			{
				const file     = Bindable.make(v[i]);
				const callback = () => this.showField(file.label);
				const label    = file.filename;

				if(!file.editor && file.value)
				{
					file.editor  = new CodeEditor({value: file.value, mode: file.type});
					file.control = file.editor;
				}

				if(file.control)
				{
					file.control.editor = this;
				}

				if(file.editor && (
					!radioBarArgs.buttons[i]
					|| file !== radioBarArgs.buttons[i].file
				)){
					file.editor.args.bindTo('value', v =>{
						const event = new CustomEvent('input', {detail: {value: v, file: file}});
						this.dispatchEvent(event);
						this.args.changed = true;
						this.args.status  = '';
						this.onTimeout(100, () => this.args.status = this.args.status = `Code updated at ${(new Date).toISOString()}.`);
					});
				}

				const button = radioBarArgs.buttons[i] = {label, callback, file};

				file.bindTo('hide', vv => {
					button.hide = vv;
				})
			}

			radioBarArgs.buttons.length = v.length;

		}, {children: true});

		this.buildPage();

		this.showField('*');

		this.args.selected = this.args.selected || 0;

		this.onRemove(Keyboard.get().keys.bindTo('Control', v => {
			this.multi = v > 0;

			this.args.multiselect = this.multi
				? 'multiselect'
				: 'select';
		}));
	}

	showField(name)
	{
		const showField = this.findTag(`[data-field="${name}"]`);
		const fields    = this.findTags('[data-field]');

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

	buildPage()
	{
		const execute = new CustomEvent('execute', {cancelable:true});

		if(!this.dispatchEvent(execute))
		{
			return false;
		}

		this.onTimeout(50, () => this.args.throttled = false);

		this.args.throttled = true;

		for(const i in this.args.files)
		{
			const file = this.args.files[i];

			if(file.control && typeof file.control.buildPage === 'function')
			{
				file.control.buildPage();
			}
		}
	}
}
