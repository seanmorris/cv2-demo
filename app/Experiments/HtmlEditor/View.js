import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.args.source = "<h1>Hello, world!</h1>\n<p>this is a double-bound HTML editor!</p>\n<p><img src = \"/player-head-180.png\" width = \"180\" height = \"180\" /></p><div><p>Nested tags should auto indent when either field blurs.</p></div>";

		this.template = require('./template.html');

		this.args.selections = [];

		this.args.selected = false;

		this.editorArgs = {xx:0};

		this.onInterval(1, () => this.editorArgs.xx++);
		// this.onInterval(10, () => this.editorArgs.xx = (new Date).toISOString());
	}

	attached()
	{
		this.args.bindTo('source', v => {
			this.args.vv = BaseView.from(v, this.editorArgs, this);
		});

		this.blur(event);
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

		console.log(formatted);

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
		this.args.selected.removeAttribute(name);
		this.format();
		this.click();
	}
}
