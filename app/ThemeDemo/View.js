import { Theme } from './Theme';
import { View as BaseView } from 'curvature/base/View';

import { TypeX } from './types/TypeX';
import { TypeY } from './types/TypeY';
import { TypeZ } from './types/TypeZ';

import { ViewX } from './views/ViewX';
import { ViewY } from './views/ViewY';
import { ViewZ } from './views/ViewZ';

import { TypeZAlpha } from './types/TypeZAlpha';
import { ViewZAlpha } from './views/ViewZAlpha';

export class View extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./template');

		const theme = Theme.get();
		const alpha = Theme.get('alpha');

		theme
			.setTemplate(ViewX, require('./views/templateX'))
			.setTemplate(ViewY, require('./views/templateY'))
			.setTemplate(ViewZ, require('./views/templateZ'))
			.setView(TypeX, ViewX)
			.setView(TypeY, ViewY)
			.setView(TypeZ, ViewZ)
		;

		alpha
			.setTemplate(ViewZAlpha, require('./views/templateZAlpha'))
			.setFallback(Theme.get())
			.setView(TypeZAlpha, ViewZAlpha)
		;

		const x = new TypeX(this);
		const y = new TypeY(this);
		const z = new TypeZ(this);
		const z𝛼 = new TypeZAlpha(this);

		this.args.views = [x,x,y,z,z𝛼].map(v => alpha.getView(v));
	}
}
