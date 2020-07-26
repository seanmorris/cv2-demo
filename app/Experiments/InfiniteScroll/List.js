import { View as BaseView } from 'curvature/base/View';

import { Row } from './Row';
export class List extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./list');

		this.args.visible = [];
		this.args.content = undefined;

		this.first = null;
		this.last  = null;

		this.args.max = 666;

		this.changing = false;
	}

	attached()
	{
		this.container = this.findTag('div[data-tag="container"]');

		const container = this.container;

		const shim = document.createElement('div');

		shim.setAttribute('data-tag', 'shim');
		shim.setAttribute('style', `position: absolute;width: 1px;height: var(--shimHeight);pointer-events: none;opacity: 0;`);

		container.append(shim);

		this.args.bindTo('rowHeight', (v,k,t) => {

			t[k] = parseInt(v);

			const rows = this.args.content.length;

			if(rows && this.args.rowHeight)
			{
				this.args.shimHeight = rows * this.args.rowHeight;
			}

			if(this.container)
			{
				this.updateViewport();
			}
		});

		this.contentDebind = this.args.bindTo('content', (v,k,t) => {

			const rows = v.length ?? 0;

			if(this.args.rowHeight)
			{
				this.args.shimHeight = rows * this.args.rowHeight;
			}

			t[k] = v;

			this.updateViewport();

		});

		this.args.rowHeight = this.args.rowHeight || 32;

		this.onNextFrame( ()=>this.updateViewport() );

	}

	updateViewport(event)
	{
		if(this.changing)
		{
			return;
		}

		const container = this.container;

		const open  = container.scrollTop;
		const space = container.offsetHeight;

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

			const row = new Row(this.args.content[i], i, this);

			this.args.visible[i] = row;

			this.args.visible[i].args.bindTo('content', v => {

				this.args.content[i] = v;

			});

		};

		this.first = first;
		this.last  = last;

		this.changing = false
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}
}
