import { Theme } from '../Theme';
import { View as BaseView } from 'curvature/base/View';

import { TypeX } from '../types/TypeX';
import { TypeY } from '../types/TypeY';
import { TypeZ } from '../types/TypeZ';

import { ViewX } from '../views/ViewX';
import { ViewY } from '../views/ViewY';
import { ViewZ } from '../views/ViewZ';

import { TypeZAlpha } from '../types/TypeZAlpha';
import { ViewZAlpha } from '../views/ViewZAlpha';

Theme.get()
	.setTemplate(ViewX, require('../views/templateX'))
	.setTemplate(ViewY, require('../views/templateY'))
	.setTemplate(ViewZ, require('../views/templateZ'))
	.setView(TypeX, ViewX)
	.setView(TypeY, ViewY)
	.setView(TypeZ, ViewZ)
;

export const XyzTheme = Theme.get();
