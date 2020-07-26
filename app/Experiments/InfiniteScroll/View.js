import { View as BaseView } from 'curvature/base/View';

import { Row } from './Row';
import { List } from './List';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.args.rows      = 100000;
		this.args.rowHeight = 32;

		const list = new List;

		this.args.list = list;

		this.args.bindTo('rowHeight', v => list.args.rowHeight = v);

		this.args.bindTo('rows', v => {

			list.args.content = Array(parseInt(v)||0).fill(0).map((v,k)=>(1+k)*10);

		});
	}

	leftPad(x)
	{
		return String(x).padStart(4,0);
	}
}
