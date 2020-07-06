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
	constructor()
	{
		super();

		this.template = require('./template');

		Theme.get()
			.setView(TypeX, ViewX)
			.setView(TypeY, ViewY)
			.setView(TypeZ, ViewZ);

		Theme.get('alpha')
			.setView(TypeZ, ViewZAlpha)
			.setFallback(Theme.get());

		const resolved = [
			Theme.get('alpha').getView(new TypeX)
			, Theme.get('alpha').getView(new TypeY)
			, Theme.get('alpha').getView(new TypeZ)
			, Theme.get('alpha').getView(new TypeZAlpha)
		];

		console.log(resolved);
	}
}
