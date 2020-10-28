import { RecordSet } from '../lib/RecordSet';
import { View } from 'curvature/base/View';

export class Records extends RecordSet
{
	length = 1000001;

	fetch(k)
	{
		const view = View.from(
			`<div class = "contents">
				<span cv-if = "ready" class = "contents">
					<i>#[[k]]</i>
					<div class = "input">
						<input placeholder = "type here" cv-bind = "val">
						<div>[[val]]</div>
					</div>
				</span>
				<span cv-if = "!ready">
					loading...
				</span>
			</div>`
			, {k}
		);

		setTimeout(()=>view.args.ready = true, 250);

		return view;
	}
}
