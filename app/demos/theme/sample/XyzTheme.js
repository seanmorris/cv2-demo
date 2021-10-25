import { Theme } from 'curvature/base/Theme';

import { TypeX } from './TypeX';
import { TypeY } from './TypeY';
import { TypeZ } from './TypeZ';

import { ViewX } from './ViewX';
import { ViewY } from './ViewY';
import { ViewZ } from './ViewZ';

export const XyzTheme = Theme.get()
.setTemplate(ViewX, require('./templateX'))
.setTemplate(ViewY, require('./templateY'))
.setTemplate(ViewZ, require('./templateZ'))
.setView(TypeX, ViewX)
.setView(TypeY, ViewY)
.setView(TypeZ, ViewZ);
