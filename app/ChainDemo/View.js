import { View as BaseView } from 'curvature/base/View';

import { View as ArrayView } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.current = null;

		this.args.objects = [];
		this.args.input   = {};

		this.args.selectedJson = '{}';

		this.args.objects.push({}, {}, {}, {});

		this.args.input.bindTo((v,k,t,d)=>{

			const selectedId = this.args.selectedId;
			const current    = this.current;

			if(!current)
			{
				return;
			}

			current[ k ] = v;

			this.args.selectedJson = JSON.stringify(current, null, 4);
		});

		this.args.bindTo('selectedId', (v,k) => {

			if(!this.args.objects[v])
			{
				return;
			}

			const selected = this.args.objects[v];

			console.log(selected);

			this.current = null;

			for(const i in this.args.input)
			{
				this.args.input[i] = null;
			}

			this.current = selected;

			for(const i in selected)
			{
				this.args.input[i] = selected[i];
			}

			this.args.selectedJson = JSON.stringify(this.current, null, 4);
		});

		this.args.selectedId = 0;
	}
}
