import { Config } from 'curvature/base/Config';
import { Theme } from 'curvature/base/Theme';
import { View } from 'curvature/base/View';

export class ViewY extends View
{
	constructor(args)
	{
		super(args);

		const themeName = Config.get('theme') || '';
		const theme     = Theme.get(theme)

		this.template = theme.getTemplate(this);
	}
}
