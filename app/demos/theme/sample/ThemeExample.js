import { Config } from 'curvature/base/Config';
import { Theme } from 'curvature/base/Theme';
import { View } from 'curvature/base/View';

import { TypeZAlpha } from './TypeZAlpha';
import { ViewZAlpha } from './ViewZAlpha';

Config.set({theme: 'alpha'});

export class ThemeExample extends View
{
	template = require('./theme-example-template.html');

	constructor()
	{
		super();

		const currentTheme = Theme.get(Config.get('theme'))
		.setTemplate(ViewZAlpha, require('./templateZAlpha'))
		.setView(TypeZAlpha, ViewZAlpha);

		const x  = new TypeX(this);
		const y  = new TypeY(this);
		const z  = new TypeZ(this);

		const z𝛼 = new TypeZAlpha(this);

		this.args.views = [x,y,z,z𝛼].map(v => currentTheme.getView(v));
	}
}
