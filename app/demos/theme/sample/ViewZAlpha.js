import { Config } from 'curvature/base/Config';
import { Theme } from 'curvature/base/Theme';
import { ViewZ } from './ViewZ';

export class ViewZAlpha extends ViewZ
{
	constructor(args)
	{
		super(args);

		const themeName = Config.get('theme') || '';
		const theme     = Theme.get(themeName);

		this.template = theme.getTemplate(this);

		this.args.vName = 'Z𝛼';
	}
}
