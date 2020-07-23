import { View as BaseView } from 'curvature/base/View';

import { View as ViewsView } from '../ViewDemo/View';
import { View as FormsView } from '../FormsDemo/View';
import { View as ThemeView } from '../ThemeDemo/View';
import { View as ConfigView } from '../ConfigDemo/View';

import { View as ScalarView } from '../ScalarDemo/View';
import { View as ChainView } from '../ChainDemo/View';
import { View as ArrayView } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

import { View as InfiniteView } from '../Experiments/InfiniteScroll/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');
		this.routes   = {
			'': () => {
				return 'home';
			}

			, views: () => {
				return new ViewsView;
			}

			, forms: () => {
				return new FormsView;
			}

			, config: () => {
				return new ConfigView;
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

			, 'infinite-scroll': () => {
				return new InfiniteView;
			}
		};
	}
}
