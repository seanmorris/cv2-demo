import { RecordSet } from '../lib/RecordSet';
import { View } from 'curvature/base/View';

export class Records extends RecordSet
{
	length = 1000000;

	fetch(k)
	{
		const view = View.from(
			`<div>
				<span cv-if = "ready">
					<i>View #<b>[[k]]!</b></i> <input placeholder = "type here" cv-bind = "x"> [[x]]
				</span>
				<span cv-if = "!ready">
					loading...
				</span>
			</div>`
			, {k}
		);

		setTimeout(()=>view.args.ready = true, 750);

		return view;
	}
}
