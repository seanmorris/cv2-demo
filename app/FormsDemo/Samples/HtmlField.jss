const View = require('curvature/base/View').View;
const Form = require('curvature/form/Form').Form;

class DemoView extends View
{
	constructor()
	{
		super();

		this.template = require('template');

		const staticHtml = {
			title:   'Radio Field'
			, type:  'html'
			, value: '<li><b><u>This is static HTML</u></b></li>'
		};

		const editableHtml = {
			title:   'Radio Field'
			, type:  'html'
			, value: '<li><b>These</b></li><li><b>Items</b></li><li><b>Are</b></li><li><b>Editable</b></li>'
			, attrs: { contenteditable: true }
		};

		this.args.form = new Form({staticHtml, editableHtml});

		this.args.form.bindTo('json', v => {

			window.parent.parent.postMessage(v, '*');

		});
	}
}
