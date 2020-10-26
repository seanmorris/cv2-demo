import { View as BaseView } from 'curvature/base/View';
import { Mixin } from 'curvature/base/Mixin';

import { Linear  } from 'curvature/animate/ease/Linear';

import { QuadIn  } from 'curvature/animate/ease/QuadIn';
import { QuadOut } from 'curvature/animate/ease/QuadOut';
import { QuadInOut } from 'curvature/animate/ease/QuadInOut';

import { CubicIn  } from 'curvature/animate/ease/CubicIn';
import { CubicOut } from 'curvature/animate/ease/CubicOut';
import { CubicInOut } from 'curvature/animate/ease/CubicInOut';

import { QuartIn  } from 'curvature/animate/ease/QuartIn';
import { QuartOut } from 'curvature/animate/ease/QuartOut';
import { QuartInOut } from 'curvature/animate/ease/QuartInOut';

import { QuintIn  } from 'curvature/animate/ease/QuintIn';
import { QuintOut } from 'curvature/animate/ease/QuintOut';
import { QuintInOut } from 'curvature/animate/ease/QuintInOut';

import { ElasticOut } from 'curvature/animate/ease/ElasticOut';

import { SineIn  } from 'curvature/animate/ease/SineIn';
import { SineOut } from 'curvature/animate/ease/SineOut';

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

		this.changing   = false;
		this.lastScroll = false;
		this.speed      = 0;
		this.topSpeed   = 0;

		this.args.topSpeed = 0;

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
		const setHeights = (v,k) => {
			container.style.setProperty(`--${k}`, `${v}px`)
		};

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

		const start = container.scrollTop;
		const depth = container.scrollHeight;
		const space = container.offsetHeight;
		const fold  = start + space;

		let first   = Math.floor(start / this.args.rowHeight);
		let last    = Math.ceil(fold / this.args.rowHeight);

		const lastScroll = {time: Date.now(), pos: start};
		
		this.onTimeout(100, ()=>{
			const timeDiff = Date.now() - lastScroll.time
			const posDiff  = container.scrollTop - start;

			this.speed = posDiff / (timeDiff / 100);
			this.args.speed = this.speed.toFixed(2);
		});
		
		if(this.snapper && !this.snapper.done)
		{
			this.snapper.cancel();
			this.snapperDone && this.snapperDone();
			this.snapperDone = false;
			
			if(this.scrollFrame)
			{
				cancelAnimationFrame(this.scrollFrame);
			}
		}

		this.args.scrollTop = start;

		if(first > this.args.content.length)
		{
			first = this.args.content.length - 1;
		}

		if(last > this.args.content.length)
		{
			last = this.args.content.length - 1;
		}

		this.setVisible(first, last);

		if(start === 0)
		{
			container.style.setProperty('--snapperOffset', `0px`);
			return;
		}

		const closeRow = Math.round(start / this.args.rowHeight);
		const groove   = closeRow * this.args.rowHeight;
		const diff     = groove - start;

		let duration = Math.abs(diff * 12);

		if(duration > 250)
		{
			duration = 250;
		}

		if(fold === depth)
		{
			return;
		}

		if(Math.abs(diff) > 5)
		{
			this.snapper = new ElasticOut(duration * 8, {repeat: 1, friction: 0.25});
		}
		else
		{
			this.snapper = new Linear(duration * 0.5, {repeat: 1});
		}

		this.snapperDone = this.onFrame(()=>{
			const offset = Math.round(this.snapper.current() * diff);
			container.style.setProperty('--snapperOffset', `${-1*offset}px`);
		});

		this.snapper.then(elapsed => {
			container.style.setProperty('--snapperOffset', `0px`);
			container.scrollTop = groove;
			this.snapperDone && this.snapperDone();
			this.snapperDone = false;
		}).catch(elapsed => {
			if(Math.abs(this.topSpeed) <= 100 && elapsed > 0.5)
			{
				const offset = Math.round(this.snapper.current() * diff);
				container.style.setProperty('--snapperOffset', `${-1*offset}px`);
				container.scrollTop = groove;
			}
		});

		this.scrollFrame = requestAnimationFrame(()=>{
			this.snapper.start();
		});
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

		if(!this.tags.list)
		{
			return;
		}

		const listTag     = this.tags.list;
		const visibleList = this.viewLists.get(listTag.element);

		this.changing = true;

		const visible = visibleList.views;

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
