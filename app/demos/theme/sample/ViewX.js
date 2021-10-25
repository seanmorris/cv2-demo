import { Config   } from 'curvature/base/Config';
import { Theme } from 'curvature/base/Theme';
import { View } from 'curvature/base/View';

export class ViewX extends View
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
