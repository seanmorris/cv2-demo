import { View } from 'curvature/base/View';

export class ExampleView extends View
{
	template = `
		<p>This is a basic view</p>
		<p><button cv-on = "click(event)" >click me.</button></p>
		<span cv-each = "eventLog:eventName:e">
        	[[e]]. [[eventName]]<br />
        </span>
		[[subview]]
	`;

	constructor(args = {}, parent)
	{
		super(args,parent);

		this.args.eventLog = [];

		const subview = View.from('<p>This is another view within a view.</p>', {}, this);

		subview.addEventListener('rendered', event => this.args.eventLog.push('Subview rendered fired.'));
		subview.addEventListener('render', event => this.args.eventLog.push('Subview render fired.'));
		subview.addEventListener('attached', event => this.args.eventLog.push('Subview attached fired.'));
		subview.addEventListener('attach', event => this.args.eventLog.push('Subview attach fired.'));

		this.args.subview = subview;
	}

	onAttached(event) { this.logEvent(event) }
	onRendered(event) { this.logEvent(event) }
	onRender(event)   { this.logEvent(event) }
	onAttach(event)   { this.logEvent(event) }
	click(event)      { this.logEvent(event) }

	logEvent(event)
	{
		this.args.eventLog.push(`Main view ${ event.type} fired.`);
	}
}
