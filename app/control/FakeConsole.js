import { View } from 'curvature/base/View';

import { CubicOut } from 'curvature/animate/ease/CubicOut';

export class FakeConsole extends View
{
	constructor(args = {}, parent)
	{
		super(args, parent);

		this.template = `<div class = "fake-console" cv-ref = "scroller" cv-each = "lines:line:l">
			<div class = "fake-console-line [[line.type]]">
				<span class = "fake-console-type">[[line.type]]:</span>
				<span class = "fake-console-items">[[line.items]]</span>
			</div>
		</div>`;

		this.args.lines = [];

		this.args.lines.bindTo(()=>{

			const start = this.tags.scroller.scrollTop;
			const end   = this.tags.scroller.scrollHeight;
			const diff  = end - start;

			const ease = new CubicOut(diff * 2);

			ease.start();

			const frame = ()=>{

				this.tags.scroller.scrollTop = start + (ease.current() * diff);

				if(!ease.done)
				{
					requestAnimationFrame(frame);
				}
			};

			frame();

		}, {wait: 0});
	}

	// onAttached()
	// {
	// 	this.editor.listen('message', event => {

	// 		const message = JSON.parse(event.data);
	// 		const type    = message.shift()
	// 		const items   = message.map(i => JSON.stringify(i)).join(', ');

	// 		this.args.lines.push({type, items});

	// 	});
	// }
}
