import { Config } from 'curvature/base/Config';
import { Theme } from 'curvature/base/Theme';
import { View } from 'curvature/base/View';

export class ViewZ extends View
{
	constructor(args)
	{
		super(args);

		const themeName = Config.get('theme') || '';
		const theme     = Theme.get(themeName);

		this.template = theme.getTemplate(this);

		this.args.vName = 'Z';
	}
}
