import { View } from 'curvature/base/View';
import { Config } from 'curvature/base/Config';

export class SvgExample extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.template         = require('./svg-example-template.svg');
		this.args.repeatCount = 'indefinite';
		this.args.color       = '#000';
		this.args.speed       = 0.333;

		this.args.bindTo('speed', v=>{
			this.args.halfSpeed = v*3;
		});
	}
}
