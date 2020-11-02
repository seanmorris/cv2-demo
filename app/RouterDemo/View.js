import { View as BaseView } from 'curvature/base/View';

import { SandboxFrame } from '../control/SandboxFrame';

import CodeMirror from 'codemirror';

import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';

import { rawquire } from 'rawquire/rawquire.macro';

export class View extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent)

		this.template = require('./template');
		this.args.orientation = 'horizontal';
		this.args.buttons = [];

		this.args.bindTo('files', v => {

			if(!v)
			{
				this.args.buttons = [];
				return;
			}

			for(const i in v)
			{
				const file     = v[i];
				const callback = () => {
					this.showField(file.label)
					this.onNextFrame(
						()=> file.editor.refresh()
					);
				};
				const label = file.filename;

				this.args.buttons[i] = ({label, callback});
			}

			this.args.buttons.length = v ? v.length : 0;

		}, {children: true, wait: 0});

		this.observer = new ResizeObserver(
			() => this.onNextFrame(()=>this.highlight())
		);
	}

	attached()
	{
		this.observer.observe(this.tags.root.node);

		const jsEditor   = this.getEditor('application/javascript');
		const htmlEditor = this.getEditor('text/html');
		const cssEditor  = this.getEditor('text/css');
		const jsonEditor = this.getEditor('application/json');

		jsEditor.setValue(rawquire('./View.js'));
		cssEditor.setValue(rawquire('./style.css'));
		htmlEditor.setValue(rawquire('./template.html'));

		const sandbox = new SandboxFrame;
		const jsTag   = jsEditor.getWrapperElement();

		this.args.files = [
			{
				filename:  '*'
				, label:   '*'
			}
			, {
				filename:  'View.js'
				, label:   'javascript'
				, type:    'application/javascript'
				, control: jsTag
				, editor:  jsEditor
			}
			, {
				filename:  'template.html'
				, label:   'html'
				, type:    'text/html'
				, control: htmlEditor.getWrapperElement()
				, editor:  htmlEditor
			}
			, {
				filename:  'style.css'
				, label:   'css'
				, type:    'text/css'
				, control: cssEditor.getWrapperElement()
				, editor:  cssEditor
			}
			// , {
			// 	filename:  'persons.json'
			// 	, label:   'json'
			// 	, type:    'application/json'
			// 	, control: jsonEditor.getWrapperElement()
			// 	, editor:  jsonEditor
			// }
			, {
				filename:  'result.html'
				, label:   'result'
				, control: sandbox
			}
		];

		this.args.selected = this.args.selected || 0;

		this.listen(jsTag, 'cvDomAttached', event => {

			jsEditor.refresh();
			htmlEditor.refresh();
			cssEditor.refresh();
			jsonEditor.refresh();

			this.showField('*');

		}, {once:true});

	}

	getEditor(mode)
	{
		const theme       = 'elegant';
		const autoRefresh = true;

		return new CodeMirror(() => {}, {mode, theme, autoRefresh});
	}

	highlight()
	{
		const index = this.args.selected;

		if(index < 0)
		{
			this.tags.highlight.style({
				height:   0
				, width:  0
				, top:    0
				, left:   0
			});
		}

		if(!this.tags.buttons || !this.tags.buttons[index])
		{
			return;
		}

		const button = this.tags.buttons[index];

		this.tags.highlight.style({
			transform: `translate(${button.offsetLeft}px, ${button.offsetTop}px)`
			, width:   `${button.offsetWidth}px`
			, height:  `${button.offsetHeight}px`
		});
	}

	click(event, button, index)
	{
		this.args.selected = index;

		this.highlight();

		button.callback(event);
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

		this.resizeEditor(event);
	}

}
