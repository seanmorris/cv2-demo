import { View as BaseView } from 'curvature/base/View';
import { DragDrop } from './DragDrop';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template.html');

		this.dragger = new DragDrop({}, this, (start, finish) => {
			const list = this.args.list;

			const a = this.args.list[start];
			const b = this.args.list[finish];

			[list[finish], list[start]] = [a, b];
		});

		this.dragger.bindTo('dragging', v => {
			this.args.dragging = v ? 'dragging' : '';
		});

		this.dragger.render(document.body);

		this.args.trackSize = 16;

		this.args.xsize = 5;
		this.args.ysize = 5;

		this.args.cols = [];
		this.args.rows = [];

		this.args.colTemplate = '';
		this.args.rowTemplate = '';

		this.args.cols.bindTo(() => requestAnimationFrame(() => {
			this.args.colTemplate = this.args.cols
				.map(c=>isNaN(c) ? c : `${c}px`)
				.join(' var(--tracksize) ');
		}));

		this.args.rows.bindTo(() => requestAnimationFrame(() => {
			this.args.rowTemplate = this.args.rows
				.map(c=>isNaN(c) ? c : `${c}px`)
				.join(' var(--tracksize) ');
		}));

		const autoX = 1;
		const autoY = 1;

		for(let x = 0; x < this.args.xsize; x++)
		{
			if(x === autoX)
			{
				this.args.cols.push('auto');
				continue;
			}
			this.args.cols.push(100);
		}

		for(let y = 0; y < this.args.ysize; y++)
		{
			if(y === autoY)
			{
				this.args.rows.push('auto');
				continue;
			}

			this.args.rows.push(100);
		}

		this.resizing = false;

		const timer = BaseView.from('<b>[[time]]</b>');

		timer.args.time = 0;
		timer.preserve  = true;

		timer.onFrame(()=>timer.args.time = (new Date).toISOString());

		const face = BaseView.from('<img src = "/player-head-180.png" />');

		face.preserve = true;

		this.args.list = [
			, 1
			, 2 //timer
			, 3
			, 4
			, 5
			, 6 //face
			, 7, 8, 9, 10 , 11, 12, 13, 14, 15, 16
			, null, null, null, null, null, null, null, null, null
		].map(x=>x && String.fromCharCode(96 + x));

		this.args._list = [];

		this.args.list.bindTo((v,k) => {
			this.args._list[k] = v;
		});
	}

	mousedown(startEvent)
	{
		this.resizing = true;

		const track = Number(event.target.style.getPropertyValue('--track'))/2;

		let mouseProp  = 'clientX';
		let trackType  = 'cols';
		let trackCount = this.args.xsize - 1;
		let max        = null;

		startEvent.target.style.pointerEvents = 'none';

		const otherElement = document.elementFromPoint(event.clientX, event.clientY);

		if(otherElement.matches('[data-resize]')
			&& otherElement.getAttribute('data-resize') !== startEvent.target.getAttribute('data-resize')
		){
			const repeatEvent = new Event('mousedown', {bubbles: true});

			repeatEvent.clientX = startEvent.clientX;
			repeatEvent.clientY = startEvent.clientY;

			otherElement.dispatchEvent(repeatEvent);
		}

		if(startEvent.target.matches('[data-resize="v"]'))
		{
			mouseProp = 'clientY';
			trackType = 'rows';
			max       = event.target.parentNode.parentNode.clientHeight;

			trackCount = this.args.ysize - 1;
		}
		else if(startEvent.target.matches('[data-resize="h"]'))
		{
			max = event.target.parentNode.parentNode.clientWidth;
		}
		else
		{
			startEvent.target.style.pointerEvents = null;
			return;
		}

		max -= ((this.args.trackSize) * trackCount) + 5;

		const prevOld = this.args[trackType][track - 1];
		const nextOld = this.args[trackType][track + 0];

		const stopMoveListener = this.listen(document, 'mousemove', moveEvent => {

			const sweep = moveEvent[mouseProp] - startEvent[mouseProp];

			let prevNew = prevOld;

			let nextOver = 0;
			let prevOver = 0;

			if(!isNaN(prevOld))
			{
				prevNew = prevOld + sweep;

				if(prevNew < 0)
				{
					prevOver = prevNew;
					prevNew = 0;
				}
			}

			let nextNew = nextOld;

			if(!isNaN(nextOld))
			{
				nextNew = nextOld - sweep;

				if(nextNew < 0)
				{
					nextOver = nextNew;
					nextNew = 0;
				}
			}

			const sizeTester = [];

			Object.assign(sizeTester, this.args[trackType]);

			sizeTester[track - 1] = prevNew;
			sizeTester[track + 0] = nextNew;

			const sizedTo = sizeTester
				.filter(x => !isNaN(x))
				.reduce((a, b) => a + b, 0);

			if(sizedTo >= max)
			{
				const diff = sizedTo - max;

				if(!isNaN(prevOld))
				{
					const prevDiff = prevNew - diff;

					sizeTester[track - 1] = prevDiff > 0 ? prevDiff : 0;
				}

				if(!isNaN(nextOld))
				{
					const nextDiff = nextNew - diff;

					sizeTester[track + 0] = nextDiff > 0 ? nextDiff : 0;
				}
			}

			if(!isNaN(prevNew) && !isNaN(nextNew))
			{
				if(prevNew <= 0)
				{
					sizeTester[track - 1] = 0;
					sizeTester[track + 0] = nextNew + prevOver;
				}

				if(nextNew <= 0)
				{
					sizeTester[track - 1] = prevNew + nextOver;
					sizeTester[track + 0] = 0;
				}

			}

			Object.assign(this.args[trackType], sizeTester);

		});

		this.listen(document, 'mouseup', endEvent => {

			startEvent.target.style.pointerEvents = '';

			stopMoveListener();

			this.resizing = false;

		}, {once: true});
	}

	mousemove(startEvent)
	{
		startEvent.target.style.pointerEvents = 'none';

		const otherElement = document.elementFromPoint(
			startEvent.clientX
			, startEvent.clientY
		);

		startEvent.target.style.pointerEvents = null;

		if(otherElement.matches('[data-resize]')
			&& otherElement.getAttribute('data-resize') !== startEvent.target.getAttribute('data-resize')
		){
			if(!startEvent.repeated)
			{
				const repeatEvent = new Event('mousemove', {bubbles: true});

				repeatEvent.clientX  = startEvent.clientX;
				repeatEvent.clientY  = startEvent.clientY;
				repeatEvent.repeated = true;
				repeatEvent.original = startEvent;

				otherElement.dispatchEvent(repeatEvent);
			}
		}
	}

	drag(event, tag, index)
	{
		if(event.target === event.currentTarget)
		{
			return;
		}

		this.dragger.containerMousedown(event, tag, index);
	}

	drop(event, tag, index)
	{
		this.dragger.containerMouseup(event, tag, index);		
	}

	hover(event, tag, index)
	{
		if(index > 14 && index < 19)
		{
			tag.style.backgroundColor = '#FCC';
			return;
		}

		tag.style.backgroundColor = '#CFC';
		this.dragger.setCursor('grabbing');
	}

	unhover(event, tag)
	{
		tag.style.backgroundColor = null;
		this.dragger.setCursor('no-drop');
	}

	stopdrop(event, tag, index)
	{
		if(index > 14 && index < 19)
		{
			event.preventDefault();
		}
	}
}