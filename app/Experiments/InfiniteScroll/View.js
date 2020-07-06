import { View as BaseView } from 'curvature/base/View';

import { Row } from './Row';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');
		this.args.visible = {};

		this.args.content = [];

		this.args.bindTo((v,k,t) => {

			if(k !== 'rows' && k !== 'rowHeight')
			{
				return;
			}

			t[k] = parseInt(v);

			if(k === 'rows')
			{
				const rows = this.args.rows;

				if(rows)
				{
					this.args.content = Array(rows).fill(0).map((v,k)=>1+k);
				}
				else
				{
					this.args.content = [];
				}

			}

			this.args.shimHeight = this.args.rows * this.args.rowHeight;

			if(this.containerTag)
			{
				this.containerScrolled();
			}
		});

		this.first = null;
		this.last  = null;

		this.changing = false;
	}

	postRender()
	{
		const container = this.findTag('div[data-tag="container"]');
		const shim = document.createElement('div');

		shim.setAttribute('data-tag', 'shim');

		container.append(shim);

		this.containerTag = container;

		this.args.rowHeight  = 32;
		this.args.rows = 10;

		this.containerScrolled();
	}

	containerScrolled(event)
	{
		if(this.changing)
		{
			return;
		}

		const containerTag = this.containerTag;

		const open  = containerTag.scrollTop;
		const space = containerTag.offsetHeight;

		let first   = Math.floor(open / this.args.rowHeight);
		let last    = Math.ceil((open+space) / this.args.rowHeight);

		if(first > this.args.content.length)
		{
			first = this.args.content.length - 1;
		}

		if(last > this.args.content.length)
		{
			last = this.args.content.length - 1;
		}

		this.setVisible(first, last);
	}

	setVisible(first, last)
	{
		if(this.changing)
		{
			return;
		}

		if(this.first === first && this.last === last)
		{
			return;
		}

		this.changing = true;

		const del = [];

		for(const i in this.args.visible)
		{
			const index = parseInt(i);
			const entry = this.args.visible[index];

			if(first === last && last === 0)
			{
				del.unshift(index);
				continue;
			}

			if(index < first || index > last)
			{
				del.unshift(index);
				continue;
			}

			if(entry && !entry.visible)
			{
				del.unshift(index);
				continue;
			}
		}

		for(const d of del)
		{
			this.args.visible[d].remove();
			delete this.args.visible[d];
		}

		for(let i = first; i <= last; i++)
		{
			if(this.args.visible[i]
				&& !this.args.visible[i].removed
				&&  this.args.visible[i].firstNode
				&&  this.args.visible[i].firstNode.getRootNode() === document
			){
				continue;
			}

			if(this.args.content.length <= i)
			{
				continue;
			}

			const value = this.args.content[i];

			this.args.visible[i] = new Row(value + '!!!', i, this);

		};

		this.first = first;
		this.last  = last;

		this.changing = false
	}
}
