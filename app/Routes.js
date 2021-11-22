import { View } from 'curvature/base/View';

import { View as HomeView     } from 'home/View';

import { View as ArrayView    } from 'demos/array/View';
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
import { View as SvgView      } from 'demos/svg/View';
import { View as ThemeView    } from 'demos/theme/View';
import { View as ViewsView    } from 'demos/view/View';

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

Object.assign(Routes, {
	'': () => {
		return new HomeView;
	}

	, 'accept-sso': () => {

		const matrix = new Matrix;

		matrix.completeSso(Router.query.loginToken);

	}

	, 'about-sean': () => View.from(require('pages/about.html'))

	, license: () => View.from(license)

	, github: () => View.from(require('pages/github.html'))

	, 'style-guide': View.from(require('pages/style-guide.html'))

	, views: () => {
		return new ViewsView;
	}

	, bindables: BindableDemoView

	, forms: () => {
		return new FormsView;
	}

	, 'matrix-api': () => {
		return new MatrixView;
	}

	, mixin: () => {
		return new MixinView;
	}

	, config: () => {
		return new ConfigView;
	}

	, routes: () => new RouteView

	, cookies: () => {
		return new CookieView;
	}

	, rules: () => {
		return new RulesView;
	}

	, themes: () => {
		return new ThemeView;
	}

	, scalars: () => {
		return new ScalarView;
	}

	, svg: () => {
		return new SvgView;
	}

	, chains: () => {
		return new ChainView;
	}

	, arrays: () => {
		return new ArrayView;
	}

	, objects: () => {
		return new ObjectView;
	}

	, models: () => {
		return new ModelsView;
	}

	, gamepad: () => new GamepadDemo
	, mouse:   () => new MouseDemo

	, keyboard: () => new KeyboardView

	, 'php': () => {
		return new PhpView;
	}

	, 'infinite-scroll': () => {
		return new InfiniteView;
	}

	, 'html-editor': () => {
		return new HtmlEditor;
	}

	, 'grid-resizer': () => {
		return new GridResizer;
	}

	, [false]: () => View.from(require('pages/404.html'))
});
