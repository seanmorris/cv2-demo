import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.args.source = "<h1>Hello, world!</h1>\n<p>this is a double-bound HTML editor!</p>\n<p><img src = \"/player-head-180.png\" width = \"180\" height = \"180\" /></p><div><p>Nested tags should auto indent when either field blurs.</p></div>";

		this.template = require('./template.html');
	}

	attached()
	{
		this.blur(event);
	}

	blur(event)
	{
		const nodes = [...this.tags.html.element.childNodes].filter(node=>{
			return node.length > 0 || node.nodeType !== node.TEXT_NODE
		});

		this.args.source = this.formatHtml(nodes, 0);

	}

	formatHtml(nodes, depth = 0)
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

				let child = this.formatHtml([...node.childNodes], depth+1);

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

		return formatted.join('');
	}
}
