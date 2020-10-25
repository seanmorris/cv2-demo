import { Theme } from './Theme';
import { View as BaseView } from 'curvature/base/View';

import { XyzTheme } from './themes/XyzTheme';

import { TypeX } from './types/TypeX';
import { TypeY } from './types/TypeY';
import { TypeZ } from './types/TypeZ';

import { TypeZAlpha } from './types/TypeZAlpha';

// import { ViewX } from './views/ViewX';
// import { ViewY } from './views/ViewY';
// import { ViewZ } from './views/ViewZ';

import { ViewZAlpha } from './views/ViewZAlpha';

import { Config } from 'curvature/base/Config';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./template');

		const theme = XyzTheme;

		console.log(theme);

		const alpha = Theme.get('alpha');

		alpha
			.setTemplate(ViewZAlpha, require('./views/templateZAlpha'))
			.setFallback(Theme.get())
			.setView(TypeZAlpha, ViewZAlpha)
		;

		const x  = new TypeX(this);
		const y  = new TypeY(this);
		const z  = new TypeZ(this);

		const z𝛼 = new TypeZAlpha(this);

		this.args.views = [x,y,z,z𝛼].map(v => {
			const view = alpha.getView(v);
			return view;
		});
	}
}
