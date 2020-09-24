import { Theme } from '../Theme';
import { Config } from 'curvature/base/Config';
import { View as BaseView } from 'curvature/base/View';

export class ViewY extends BaseView
{
	constructor(args)
	{
		super(args);

		const themeName = Config.get('theme') || '';
		const theme     = Theme.get(theme)

		this.template = theme.getTemplate(this);
	}
}
