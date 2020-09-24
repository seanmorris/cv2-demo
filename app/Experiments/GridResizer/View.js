import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template.html');

		this.args.trackSize = '5';

		this.args.xsize = 4;
		this.args.ysize = 4;

		this.args.cols = [];
		this.args.rows = [];

		this.args.colTemplate = '';
		this.args.rowTemplate = '';

		this.args.cols.bindTo(()=>requestAnimationFrame(()=>{
			this.args.colTemplate = this.args.cols
				.map(c=>isNaN(c) ? c : `${c}px`)
				.join(' var(--tracksize) ');
		}));

		this.args.rows.bindTo(()=>requestAnimationFrame(()=>{
			this.args.rowTemplate = this.args.rows
				.map(c=>isNaN(c) ? c : `${c}px`)
				.join(' var(--tracksize) ');
		}));

		const autoX = 2;
		const autoY = 2;

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
	}

	mousedown(startEvent)
	{
		this.resizing = true;

		const track = Number(event.target.style.getPropertyValue('--track'))/2;

		let mouseProp  = 'clientX';
		let trackType  = 'cols';
		let trackCount = this.args.xsize - 1;
		let max        = null;

		if(startEvent.target.matches('[data-resize="v"]'))
		{
			mouseProp = 'clientY';
			trackType = 'rows';
			let trackCount = this.args.ysize - 1;
			max       = event.target.parentNode.parentNode.clientHeight;
		}
		else
		{
			max = event.target.parentNode.parentNode.clientWidth;
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

			stopMoveListener();

			this.resizing = false;

		}, {once: true});
	}

	mouseup(event)
	{

	}

}
