import { Config   } from 'curvature/base/Config';
import { View as BaseView } from 'curvature/base/View';

import { Theme } from '../Theme';

export class ViewX extends BaseView
{
	constructor(args)
	{
		super(args);

		const themeName = Config.get('theme') || '';
		const themeList = Theme.get(
			themeName             // App config theme
			, ''                  // App default theme
			, 'app/cv2playground' // App specific theme
			, 'lib/curvature'     // Library-specific theme
			, 'base'              // Base theme
		);

		this.template = themeList.getTemplate(this);
	}
}
