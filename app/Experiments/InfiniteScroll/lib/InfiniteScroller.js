import { View as BaseView } from 'curvature/base/View';

import { Mixin } from 'curvature/base/Mixin';

import { Tag } from 'curvature/base/Tag';

import { GeoIn      } from 'curvature/animate/ease/GeoIn';
import { GeoOut     } from 'curvature/animate/ease/GeoOut';
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

		this.args.visible   = [];
		this.args.content   = undefined;

		this.first          = null;
		this.last           = null;

		this.changing       = false;
		this.lastScroll     = false;
		this.topSpeed       = 0;
		this.speed          = 0;

		this.args.width     = '100%';
		this.args.height    = '100%';
		this.args.scrollTop = 0;
		this.args.scrollDir = 0;

		this.args.rowHeight = this.args.rowHeight || 32;

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
		const container = this.container = this.tags.list;
		const shim = new Tag('<div data-tag = "shim">');

		container.style({
			overflowY:  'scroll'
			, position: 'relative'
			, display:  'block'
			, width:    '100%'
		});

		shim.style({
			pointerEvents: 'none'
			, position:    'absolute'
			, opacity:     0
			, height:      'var(--shimHeight)'
			, width:       '1px'
		});

		container.append(shim.element);

		const setHeights = (v,k) => container.style({[`--${k}`]: `${v}px`});

		this.args.bindTo('height', v => container.style({height: v}));
		this.args.bindTo('width', v => container.style({width: v}));

		this.args.bindTo('rowHeight', setHeights);
		this.args.bindTo('shimHeight', setHeights);

		this.args.bindTo('rowHeight', (v,k,t) => {

			t[k] = parseInt(v);

			const headerRow = this.header() ? 1 : 0;

			const rows = headerRow + this.args.content ? this.args.content.length : 0;

			this.args.shimHeight = rows * this.args.rowHeight;

			this.container.scrollTop = this.first * this.args.rowHeight;

			this.updateViewport();
		});

		this.contentDebind = this.args.bindTo('content', (v,k,t) => {

			const headerRow = this.header() ? 1 : 0;

			const rows = headerRow + v ? v.length : 0;

			this.args.shimHeight = rows * this.args.rowHeight;

			this.onNextFrame(()=> this.updateViewport());

			this.lengthDebind && this.lengthDebind();

			if(v)
			{
				this.lengthDebind = v.bindTo('length', v => {

					v = Number(v);

					this.args.shimHeight = (v + headerRow) * this.args.rowHeight;

					this.onNextFrame(() => this.updateViewport());
				});

			}

			this.updateViewport();
		});

		this.listen('scroll', event => this.updateViewport(event));

		this.updateViewport();
	}

	updateViewport(event)
	{
		this.snapper && this.snapper.cancel();

		if(this.changing)
		{
			return;
		}

		const container = this.container;

		const start = this.args.scrollTop    = container.scrollTop;
		const depth = this.args.scrollHeight = container.scrollHeight;
		const space = container.offsetHeight;
		const fold  = start + space;

		this.args.scrollMax = depth - space;

		let first = Math.floor(start / this.args.rowHeight);
		let last  = Math.ceil(fold / this.args.rowHeight);

		const lastScroll = {time: Date.now(), pos: start};

		if(!this.speedTimer)
		{
			this.speedTimer = this.onTimeout(100, ()=>{
				const timeDiff = Date.now() - lastScroll.time
				const posDiff  = container.scrollTop - start;

				this.speed = (posDiff / timeDiff) * 1000;

				const absSpeed = Math.abs(this.speed);

				if(absSpeed > Math.abs(this.topSpeed))
				{
					this.topSpeed = this.speed;
				}

				if(!this.speed)
				{
					this.topSpeed = this.speed;
				}

				this.args.speed = this.speed.toFixed(2);
			});

			this.speedTimer = false;
		}

		if(!this.args.content && !Array.isArray(this.args.content))
		{
			return;
		}

		if(first > this.args.content.length)
		{
			first = this.args.content.length - 1;
		}

		if(last > this.args.content.length)
		{
			last = this.args.content.length - 1;
		}

		this.setVisible(first, last);

		if(start === 0 || fold === depth)
		{
			container.style({'--inertiaOffset': `0px`});
			container.style({'--snapperOffset': `0px`});
			return;
		}

		if(!event)
		{
			return;
		}

		const closeRow = Math.round(start / this.args.rowHeight);
		const groove   = closeRow * this.args.rowHeight;
		const diff     = groove - start;

		let duration = Math.abs(diff * this.args.rowHeight / 2);

		if(duration > 192)
		{
			duration = 192;
		}

		const snapper = Math.abs(diff) > 3
			? new ElasticOut(duration * 13, {friction: 0.15})
			: new GeoIn(duration, {power: 5});

		this.snapperDone && this.snapperDone();

		this.snapperDone = this.onFrame(()=>{
			const offset = snapper.current() * diff;
			container.style({'--snapperOffset': `${-1*offset}px`});
		});

		snapper.then(elapsed => {

			this.onNextFrame(()=> {
				container.style({'--snapperOffset': 0});
				container.node.scrollTop = groove;
			});

			this.snapperDone();
			event.preventDefault();

		}).catch(elapsed => {
			const offset = this.snapper.current() * diff;
			container.style({'--snapperOffset': `${-1*offset}px`});
		});

		this.scrollFrame && cancelAnimationFrame(this.scrollFrame);

		this.scrollFrame = requestAnimationFrame(()=> snapper.start());

		this.snapper = snapper;
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

	header()
	{
		if(!this.args.content)
		{
			return false;
		}

		if(typeof this.args.content.header !== 'function')
		{
			return false;
		}

		return this.args.content.header();
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}
}
