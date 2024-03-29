import { View } from 'curvature/base/View';

import { View as HomeView     } from 'home/View';

import { View as ArrayView    } from 'demos/array/View';
import { AjaxView             } from 'demos/ajax/AjaxView';
import { BindableDemoView     } from 'demos/bindable/BindableDemoView';
import { View as ChainView    } from 'demos/chain/View';
import { View as ConfigView   } from 'demos/config/View';
import { View as CookieView   } from 'demos/cookie/View';
import { View as FormsView    } from 'demos/form/View';
import { GamepadDemo          } from 'demos/gamepad/GamepadDemo';
import { View as KeyboardView } from 'demos/keyboard/View';
import { View as MixinView    } from 'demos/mixin/View';
import { View as MatrixView   } from 'demos/matrix/View';
import { View as ModelsView   } from 'demos/model/View';
import { MouseDemo            } from 'demos/mouse/MouseDemo';
import { View as ObjectView   } from 'demos/object/View';
import { View as RouteView    } from 'demos/router/View';
import { View as RulesView    } from 'demos/rules/View';
import { View as ScalarView   } from 'demos/scalar/View';
import { NotifyDemo           } from 'demos/service/NotifyDemo';
import { LocalHttpDemo        } from 'demos/service/LocalHttpDemo';
import { InteropDemo          } from 'demos/service/InteropDemo';
import { View as SvgView      } from 'demos/svg/View';
import { View as ThemeView    } from 'demos/theme/View';
import { View as ViewsView    } from 'demos/view/View';
import { BagDemo              } from 'demos/bag/BagDemo';
import { EventSourceDemo      } from 'demos/event-source/EventSourceDemo';

import { PeerDemo             } from 'demos/peer/PeerDemo';

import { View as GridResizer  } from 'experiments/GridResizer/View';
import { View as HtmlEditor   } from 'experiments/HtmlEditor/View';
import { View as InfiniteView } from 'experiments/InfiniteScroll/View';
import { View as PhpView      } from 'experiments/Php/View';


import { Matrix } from 'matrix-api/Matrix';

import { rawquire } from 'rawquire/rawquire.macro';

import { Router } from 'curvature/base/Router';

const license = `<pre class = "wrap">${rawquire('../node_modules/curvature/NOTICE')}<hr />
${rawquire('../NOTICE')}<hr />
${rawquire('../LICENSE')}
</pre>`;

export const Routes = Routes || {};

const InternalError = Router.InternalError;
const NotFoundError = Router.NotFoundError;

Object.assign(Routes, {
	'': HomeView

	, 'accept-sso': () => {

		document.write();

		const matrix = new Matrix;

		matrix.completeSso(Router.query.loginToken);

	}

	, github:  () => View.from(require('pages/github.html'))
	, license: () => View.from(license)

	, ajax:      () => new AjaxView
	, views:     () => new ViewsView
	, bindables: () => new BindableDemoView
	, forms:     () => new FormsView
	, 'matrix-api': () => new MatrixView
	, mixin:     () => new MixinView
	, notifications: () => new NotifyDemo
	, 'local-http':  () => new LocalHttpDemo
	, interop:   () => new InteropDemo
	, config:    () => new ConfigView
	, routes:    () => new RouteView
	, cookies:   () => new CookieView
	, rules:     () => new RulesView
	, themes:    () => new ThemeView
	, scalars:   () => new ScalarView
	, svg:       () => new SvgView
	, chains:    () => new ChainView
	, arrays:    () => new ArrayView
	, objects:   () => new ObjectView
	, models:    () => new ModelsView
	, gamepad:   () => new GamepadDemo
	, mouse:     () => new MouseDemo
	, keyboard:  () => new KeyboardView
	, bags:      () => new BagDemo
	, php:       () => new PhpView
	, peer:      () => new PeerDemo

	, 'infinite-scroll': () => { setTimeout(() => Router.go('/scrollers'), 10); }

	, 'scrollers':    () => new InfiniteView
	, 'html-editor':  () => new HtmlEditor
	, 'grid-resizer': () => new GridResizer
	, 'event-source': () => new EventSourceDemo

	, [InternalError]: ({[InternalError]:error}) => View.from(`<small>Error Caught</small><pre>${error.stack ?? error}</pre>`)
	, [NotFoundError]: () => View.from(require('pages/404.html'))
});
