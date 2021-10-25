import { View } from 'curvature/base/View';
import { Tag  } from 'curvature/base/Tag';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';

import { rawquire } from 'rawquire/rawquire.macro';

export class CodeEditor extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = `[[editor]]`;

		this.editorDefaults = {
			mode:           'application/javascript'
			// , theme:        'elegant'
			, gutter:       true
			, lineNumbers:  true
			, autoRefresh:  true
			, value:        ''
		};

		Object.assign(this.args, {...this.editorDefaults, ...this.args});

		const editor  = new CodeMirror(() => {}, this.editorDefaults);
		const options = Object.keys(this.editorDefaults);

		this.args.bindTo(options, (v,k) => {
			if(k === 'value')
			{
				v = String(v);

				if(editor.getValue() !== v)
				{
					editor.setValue(v);
					editor.refresh();
				}

				return;
			}

			editor.setOption(k, v);
		});

		const editorTag = new Tag(editor.getWrapperElement());

		editorTag.style({width: '100%'})

		this.resizeTimer = false;

		this.args.editor = editorTag;
		this.editorHtml = editor;

		editor.on('change', (editor, change) => {
			this.args.value = editor.getValue();
		});
	}

	onAttach()
	{
		this.observer = new ResizeObserver(
			() => {
				this.onNextFrame(() => this.editorHtml.refresh())
			}
		);

		this.observer.observe(this.args.editor.node);
	}
}
