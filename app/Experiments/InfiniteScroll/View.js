import { View as BaseView } from 'curvature/base/View';

import { InfiniteScroller } from './lib/InfiniteScroller';

import { Records as ViewRecords } from './views/Records'
import { Records as StringRecords } from './strings/Records'

import { Scroller as GridScroller } from './sliders/Scroller';
import { SliderRecords } from './sliders/SliderRecords';

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
			gridScroller.args.max     = v;
		});

		this.args.bindTo('rows', v => {
			recordSet.changed(v);
		});

		this.args.arrayScroller =  new InfiniteScroller;

		this.args.arrayScroller.args.content = Array(1000000).fill(1).map((v,k)=>k);

		this.args.stringScroller =  new InfiniteScroller;

		this.args.stringScroller.args.content = new StringRecords;

		this.args.viewScroller = new InfiniteScroller;

		this.args.viewScroller.args.content = new ViewRecords;
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}
}
