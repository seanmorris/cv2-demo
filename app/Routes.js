import { View } from 'curvature/base/View';

import { View as HomeView   } from 'Home/View';
import { View as ViewsView  } from 'ViewDemo/View';
import { View as FormsView  } from 'FormsDemo/View';
import { View as ThemeView  } from 'ThemeDemo/View';
import { View as ConfigView } from 'ConfigDemo/View';
import { View as CookieView } from 'CookieDemo/View';
import { View as RulesView  } from 'RulesDemo/View';

import { View as ScalarView } from 'ScalarDemo/View';
import { View as ChainView  } from 'ChainDemo/View';
import { View as ArrayView  } from 'ArrayDemo/View';
import { View as ObjectView } from 'ObjectDemo/View';
import { View as ModelsView } from 'ModelsDemo/View';

import { View as InfiniteView } from 'Experiments/InfiniteScroll/View';
import { View as HtmlEditor   } from 'Experiments/HtmlEditor/View';
import { View as GridResizer  } from 'Experiments/GridResizer/View';
import { View as PhpView      } from 'Experiments/Php/View';

export const Routes = {
	'': () => {
		return new HomeView;
	}

	, 'about-sean': () => View.from(require('pages/about.html'))

	, 'github': () => View.from(require('pages/github.html'))

	, views: () => {
		return new ViewsView;
	}

	, forms: () => {
		return new FormsView;
	}

	, config: () => {
		return new ConfigView;
	}

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
};
