import { View as BaseView } from 'curvature/base/View';
import { Mixin } from 'curvature/base/Mixin';

import { Linear  } from 'curvature/animate/ease/Linear';
import { QuintIn } from 'curvature/animate/ease/QuintIn';
import { QuintInOut } from 'curvature/animate/ease/QuintInOut';
import { ElasticOut } from 'curvature/animate/ease/ElasticOut';

import { Row } from './Row';

export class InfiniteScroller extends Mixin.from(BaseView)
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./infinite-scroller');

		this.preRuleSet.add('[cv-ref="list"]', ({element}) => {
			element.setAttribute('tabindex', -1);
			element.setAttribute('cv-each', 'visible:row:r');
			element.setAttribute('cv-view', 'Experiments/InfiniteScroll/lib/Row');
		});

		this.args.visible = [];
		this.args.content = undefined;

		this.first = null;
		this.last  = null;

		this.changing = false;

		this.args.width  = '100%';
		this.args.height = '100%';
		this.args.scrollTop = 0;
		this.args.scrollDir = 0;

		this.autoScrolling = false;

		this.args.bindTo('scrollTop', (v,k,t) => {
			this.args.scrollDir = 0;

			if(v > t[k])
			{
				this.args.scrollDir = 1;
			}
			else if(v < t[k])
			{
				this.args.scrollDir = -1;
			}
		});
	}

	attached()
	{
		const container  = this.container = this.tags.list.element;
		const setHeights = (v,k) => container.style.setProperty(
			`--${k}`, `${v}px`
		);

		this.args.bindTo('height', v => container.style.height = v);
		this.args.bindTo('width', v => container.style.height = v);

		container.style.position  = 'relative';
		container.style.overflowY = 'scroll';
		container.style.display   = 'block';
		container.style.width     = '100%';

		this.args.bindTo('rowHeight', setHeights);
		this.args.bindTo('shimHeight', setHeights);

		this.listen(
			container
			, 'scroll'
			, event => this.updateViewport(event)
			, {passive: true}
		);

		const shim = document.createElement('div');

		shim.setAttribute('data-tag', 'shim');
		shim.setAttribute('style', `position: absolute;width: 1px;height: var(--shimHeight);pointer-events: none;opacity: 0;`);

		container.append(shim);

		this.args.bindTo('rowHeight', (v,k,t) => {

			t[k] = parseInt(v);

			const rows = this.args.content.length;

			if(rows && this.args.rowHeight)
			{
				this.args.shimHeight = (rows * this.args.rowHeight).toFixed(2);
			}

			if(this.container)
			{
				this.updateViewport();
			}
		});

		this.contentDebind = this.args.bindTo('content', (v,k,t) => {

			t[k] = v;

			const rows = v.length ?? 0;

			if(this.args.rowHeight)
			{
				this.args.shimHeight = rows * this.args.rowHeight;
			}

			this.updateViewport();

		});

		this.args.content.bindTo('length', (v,k,t) => {

			t[k] = v;

			const rows = v ?? 0;

			if(this.args.rowHeight)
			{
				this.args.shimHeight = rows * this.args.rowHeight;
			}

			this.updateViewport();

		}, {wait: 0});

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

		this.args.scrollTop = open;

		if(first > this.args.content.length)
		{
			first = this.args.content.length - 1;
		}

		if(last > this.args.content.length)
		{
			last = this.args.content.length - 1;
		}

		this.setVisible(first, last);

		if(this.ease)
		{
			this.ease.cancel();
		}
		
		if(this.scrollTimeout)
		{
			clearTimeout(this.scrollTimeout);
		}

		const start    = container.scrollTop;
		const closeRow = Math.round(start / this.args.rowHeight);
		const groove   = closeRow * this.args.rowHeight;
		const diff     = groove - start;

		let duration = Math.abs(diff * 12);

		// if(duration < 95)
		// {
		// 	duration = 95;
		// }
		
		if(duration > 500)
		{
			duration = 500;
		}

		if(this.ease)
		{
			this.ease.cancel();
		}

		this.ease = new ElasticOut(duration * 8, {repeat: 1, friction: 0.2});
		// this.ease = new QuintInOut(duration * 4, {repeat: 1});

		this.ease
			.then(() => this.onFrame(() => container.style.setProperty('--scrollOffset', '0px')))
			.catch(()=>{})
			.finally(()=>{});

		this.framesDone = this.onFrame(()=>{
			const offset = Math.round(this.ease.current() * diff);
			this.onNextFrame(()=>{
				container.style.setProperty('--scrollOffset', `${-1*offset}px`);
			});
		});

		this.ease.then(() => {
			const offset = Math.round(this.ease.current() * diff);
			
			this.onNextFrame(()=>{
				container.scrollTop = groove;
				// container.style.setProperty('--scrollOffset', `${offset}px`);					
				this.framesDone && this.framesDone();
				this.framesDone = false;
			});
			
		}).catch(()=>{});

		this.ease.start();
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

		const visible = this.viewLists.visible.views;

		const del = [];

		for(const i in visible)
		{
			const index = parseInt(i);
			const entry = visible[index];

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

			if(entry && (!entry.visible || entry.removed))
			{
				del.unshift(index);
				continue;
			}
		}

		for(const d of del)
		{
			if(d === 0)
			{
				continue;
			}

			visible[d].remove();

			delete visible[d];
			delete this.args.visible[d];
		}

		for(let i = first; i <= last; i++)
		{
			if(visible[i]
				&& !visible[i].removed
				&&  visible[i].firstNode
				&&  visible[i].firstNode.getRootNode() === document
			){
				continue;
			}

			if(this.args.content.length <= i)
			{
				continue;
			}

			this.args.visible[i] = this.args.content[i];
		};

		this.first = first;
		this.last  = last;

		this.changing = false;
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}
}