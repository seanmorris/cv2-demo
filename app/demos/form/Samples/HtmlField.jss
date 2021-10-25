const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		const staticHtml = {
			title:   'Static HTML Field'
			, type:  'html'
			, value: '<li><b><u>This is static HTML</u></b></li>'
		};

		const editableHtml = {
			title:   'Editable HTML Field'
			, type:  'html'
			, attrs: { contenteditable: true }
			, value: `<li><b>These</b></li>
<li><b>Items</b></li>
<li><b>Are</b></li>
<li><b>Editable</b></li>
<li onclick = "this.remove()"><b>This one removes on click!</b></li>`
		};

		this.args.form = new Form({staticHtml, editableHtml});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
