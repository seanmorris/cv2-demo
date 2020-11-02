import { View as BaseView } from 'curvature/base/View';

import { Tag } from 'curvature/base/Tag';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template.html');

		this.args.selections = [];
		this.args.selected   = false;
		this.editorArgs      = {};
	}

	postRender()
	{
		this.args.source = `<h1>[[title]]</h1>
<p>[[tagline]]</p>
<p><img src = "/player-head.png" cv-expand = "img" /></p>
<p>Here is a list of people from <a target = "blank" href = "https://fakerapi.it/">fakerapi.it</a></p>
<ul cv-each = "persons:person:p">
	<li>[[person.firstname]] [[person.lastname]]</li>
</ul>
`;

		this.args.bindTo(
			'source'
			, v => this.args.vv = BaseView.from(v, this.editorArgs, this)
			, {frame: 1}
		);

		const editor = this.newEditor();

		editor.on('beforeChange', (editor, change) =>
			this.beforeEdit = editor.getValue()
		);

		editor.on('change', (editor, change) => {
			const current = editor.getValue();
			const input   = {};

			try
			{
				Object.assign(input, JSON.parse(current || '{}'));
			}
			catch(error)
			{
			}

			Object.assign(this.editorArgs, input);
		});

		this.editor = editor;

		this.args.jsonEdit = editor.display.wrapper;

		this.sourceData = {
			title: 'Hello, world!'
			, tagline: 'this is a double-bound HTML editor!'
			, persons: []
			, img:  {
				width:    180
				, height: 180
				, style:  'image-rendering: pixelated'
			}
		};

		editor.setValue(JSON.stringify(this.sourceData, null, 4));

		this.blur(event);

		this.args.jsonUrl = 'https://fakerapi.it/api/v1/persons?_quantity=10'

		fetch(this.args.jsonUrl).then(r=>r.json()).then(r=>{

			if(!r.data)
			{
				return;
			}

			this.onTimeout(250, () => {
				this.sourceData.persons = r.data;
				editor.setValue(JSON.stringify(this.sourceData, null, 4));
				// editor.refresh();
				this.blur(event);
			});
		});
	}

	blur()
	{
		this.format();
		// this.args.selected = false;
		// delete this.args.selections[0];
	}

	format()
	{
		const element = this.tags.html.element;

		const nodes = [...element.childNodes].filter(node=>{
			return node.length > 0 || node.nodeType !== node.TEXT_NODE
		});

		this.args.source = this.formatNodes(nodes, 0);
	}

	formatNodes(nodes, depth = 0)
	{
		const indent = ' '.repeat(depth * 4);

		const formatted = [];

		for(const i in nodes)
		{
			const node = nodes[i];

			let line;

			if(node.hasChildNodes())
			{
				const open  = node.cloneNode(false).outerHTML.replace(/\<\/.+/, '');
				const close = `</${node.tagName.toLowerCase()}>`;

				let child = this.formatNodes([...node.childNodes], depth+1);

				if(node.querySelector('*'))
				{
					child = "\n" + "\t".repeat((depth + 1))
					+ child.trim()
					+ "\n" + "\t".repeat((depth + 0))
				}
				else
				{
					child = child.trim();
				}

				line = open + child + close + "\n";
			}
			else
			{
				line = String(node.outerHTML || node.textContent).trim();
			}

			if(line)
			{
				formatted.push(indent + line + "\n");
			}
		}

		// console.log(formatted);

		return formatted.join('');
	}

	click(event)
	{
		const target = event
			? event.target
			: this.args.selected;


		this.args.selected = target;

		this.args.tagName = String(target.tagName).toLowerCase();

		delete this.args.selections[0];

		this.onNextFrame(()=>{
			this.args.selections[0] = {
				left:   target.offsetLeft,
				top:    target.offsetTop,
				width:  target.clientWidth,
				height: target.clientHeight
			};

			this.args.attributes = [];

			for(let i = 0; i < target.attributes.length; i++)
			{
				const attrControl = {
					value:   target.attributes[i].value
					, name:  target.attributes[i].name
					, index: i
				};

				this.args.attributes.push(attrControl);

				attrControl.bindTo('value', v => {
					target.attributes[i].value = v;
					this.format();
				});
			}
		});
	}

	newAttribute()
	{
		this.args.adding = true;
	}

	addAttribute()
	{
		this.args.adding = false;

		this.args.selected.setAttribute(this.args.newAttrName, this.args.newAttrValue);
		this.format();
		this.click();
	}

	removeAttr({name})
	{
		this.args.selected.removeAttribute(name);``
		this.format();
		this.click();
	}

	newEditor()
	{
		const textbox = new Tag(`<textarea>`);

		const editor = CodeMirror(textbox, {
			theme:        'elegant'
			, autoRefresh: true
			, mode:        'application/json'
		});

		this.onNextFrame(()=> editor.refresh());

		return editor;
	}

	loadJson(event)
	{
		event.preventDefault();

		fetch(this.args.jsonUrl).then(r=>r.json()).then(r=>{
			if(!r.data)
			{
				return;
			}
			this.onTimeout(250, () => {

				if(!this.args.jsonEdit)
				{
					return;
				}

				this.sourceData.persons = r.data;

				this.editor.setValue(JSON.stringify(this.sourceData, null, 4));

				this.blur(event);
			});
		});
	}
}
