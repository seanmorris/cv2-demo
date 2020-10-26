import { View as BaseView } from 'curvature/base/View';

import { InfiniteScroller } from './lib/InfiniteScroller';

import { Records as ViewRecords } from './views/Records'
import { Records as StringRecords } from './strings/Records'

import { Scroller as GridScroller } from './sliders/Scroller';
import { SliderRecords } from './sliders/SliderRecords';

import { Ease    } from 'curvature/animate/Ease';
import { Linear  } from 'curvature/animate/ease/Linear';

import { GeoIn  }   from 'curvature/animate/ease/GeoIn';
import { GeoOut }   from 'curvature/animate/ease/GeoOut';
// import { GeoInOut } from 'curvature/animate/ease/GeoInOut';

import { SineIn  }   from 'curvature/animate/ease/SineIn';
import { SineOut }   from 'curvature/animate/ease/SineOut';
import { SineInOut } from 'curvature/animate/ease/SineInOut';

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

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.args.rows      = 10;
		this.args.rows      = 1000001;
		this.args.rowHeight = 32;

		const gridScroller = new GridScroller;

		this.args.gridScroller = gridScroller;

		this.args.bindTo('rowHeight', v => gridScroller.args.rowHeight = v);

		const recordSet = new SliderRecords();

		gridScroller.args.content = recordSet;

		recordSet.bindTo('length', v => {
			gridScroller.args.max = v;
		});

		this.args.bindTo('rows', v => {
			recordSet.changed(v);
		});

		this.args.arrayScroller = new InfiniteScroller;

		this.args.arrayScroller.args.content = Array(1000000).fill(1).map((v,k)=>k);

		this.args.stringScroller = new InfiniteScroller;

		this.args.stringScroller.args.content = new StringRecords;

		this.args.viewScroller = new InfiniteScroller;

		this.args.viewScroller.args.content = new ViewRecords;

		const friction = 0.1;

		const easeIn = new SineOut(750, {
			friction:  0.35
			, power:   5
			, reverse: 0
			, repeat:  1
		});

		const easeOut = new SineIn(750, {
			reverse:  1
			, power:  1
			, repeat: 1
		});

		const cancelFrames = this.onFrame(()=>{
			if(!easeIn.done)
			{
				this.args.xx = 500 * easeIn.current();
			}
			else if(!easeOut.done)
			{
				this.args.xx = 500 * easeOut.current();
			}
		});

		// this.onTimeout(751, () => easeIn.cancel());

		easeIn.then(() => {

				easeOut.start();

				easeOut.then(() => cancelFrames());
			});

		this.onTimeout(250, () => easeIn.start());
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}

	round(input)
	{
		return Math.round(input);
	}
}
