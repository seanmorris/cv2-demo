import { Service  } from 'curvature/service/Service';
import { Router   } from 'curvature/base/Router';

import { View     } from './layout/View';
import { Routes   } from './Routes';

Service.register('/notify-service.js');

document.addEventListener('DOMContentLoaded', () => {
	const view = new View;
	Router.listen(view, Routes);
	view.render(document.body);
});
