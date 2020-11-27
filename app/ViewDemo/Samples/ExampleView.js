import { View } from 'curvature/base/View';

export class ExampleView extends View
{
	template = `
		<p>This is a basic view</p>
		<button cv-on = "click(event)" >click me.</button>
		<div cv-each = "eventLog:eventName:e">[[e]]. [[eventName]]<br /></div>
		[[subview]]
	`;

	constructor(args = {}, parent)
	{
		super(args,parent);

		this.args.eventLog = [];

		const subview = View.from('<p>This is another view within a view.</p>');

		subview.addEventListener('render', event => this.args.eventLog.push('Subview rendered!'));
		subview.addEventListener('attached', event => this.args.eventLog.push('Subview attached!'));

		this.args.subview = subview;
	}

	click(event)
	{
		this.args.eventLog.push(event.type + ' fired.');
	}

	onRender(event)
	{
		this.args.eventLog.push(event.type + ' fired.');
	}

	onAttached(event)
	{
		this.args.eventLog.push(event.type + ' fired.');
	}
}
