import { Theme } from '../Theme';
import { Config } from '../../Config';
import { View as BaseView } from 'curvature/base/View';

export class ViewZ extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = Theme.get(Config.theme || '').getTemplate(this);
	}
}
