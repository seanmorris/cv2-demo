import { View as BaseView } from 'curvature/base/View';

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

import { LoneScrollbar } from '../../control/LoneScrollbar';

import { HyperScroller } from 'cv2-hyperscroll/HyperScroller';

export class View extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template = require('./template');

		this.args.rows      = 0;
		this.args.rowHeight = 16;

		const gridScroller = new GridScroller;

		this.args.gridScroller = gridScroller;

		this.args.bindTo('changedScroll', v => gridScroller.args.changedScroll = v);
		this.args.bindTo('rowHeight', v => gridScroller.args.rowHeight = v);

		this.args.simpleRows = 1000;

		this.args.arrayScroller  = new HyperScroller({rowHeight: 17});
		this.args.stringScroller = new HyperScroller({rowHeight: 17});
		this.args.viewScroller   = new HyperScroller({rowHeight: 17});

		this.args.infiniteVertScroller  = new LoneScrollbar({size: 1000, value: 500});

		this.args.vertScroller  = new LoneScrollbar;
		this.args.horizScroller = new LoneScrollbar({horizontal: true});
	}

	onAttached()
	{
		this.args.viewScroller.args.content   = new ViewRecords;
		this.args.viewScroller.updateViewport();

		this.args.stringScroller.args.content = new StringRecords;
		this.args.stringScroller.updateViewport();

		this.args.arrayScroller.args.content  = Array(this.args.simpleRows).fill(1).map((v,k)=>this.thousands(k));
		this.args.arrayScroller.updateViewport();

		const recordSet = new SliderRecords();

		this.args.gridScroller.args.content = recordSet;

		this.args.bindTo('rows', v => {
			recordSet.changed(v)
			this.args.gridScroller.updateViewport();
		});

		this.args.rows = 1_000_000;
	}

	thousands(x)
	{
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}

	round(input)
	{
		return Math.round(input);
	}

	increase(event)
	{
		this.args.simpleRows = 1000000;
		this.args.arrayScroller.args.content  = Array(1000000).fill(1).map((v,k)=>this.thousands(k));
	}
}
