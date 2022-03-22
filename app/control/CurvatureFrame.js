import { View } from 'curvature/base/View';
import { Tag  } from 'curvature/base/Tag';

import { SandboxFrame } from './SandboxFrame'

export class CurvatureFrame extends SandboxFrame
{
	buildPage()
	{
		if(!this.editor)
		{
			return;
		}

		const sampleHtml = (
			'<'+'html><'+'head>'
				+ '<'+`script >const exports = {};<`+'/script>'
				+ '<'+'script src="https://unpkg.com/@babel/standalone@7.12.6/babel.js"><'+'/script>'
				+ '<'+`script src="${location.origin}/curvature.js"><`+'/script>'

				+ this.editor.args.files
					.filter(file => ['text/html', 'application/xml'].includes(file.type))
					.map(file => `<`
						+`script type = "text/babel" data-presets = "es2015" data-module = "${file.filename}">`
						+ `require.register('./'+${JSON.stringify(file.filename)}, (_exports, require, module) => module.exports = ${JSON.stringify(file.editor.args.value)});`
						+ `<` + `/script>`)
					.join('')

				+ this.editor.args.files
					.filter(file=>file.type === 'application/javascript')
					.map(file=>`<`+`script type = "text/babel" data-presets = "es2015" data-module = "${file.filename.replace(/\..+/,'')}">`
						+ file.editor.args.value + `;`
						+ `require.register('./'+${JSON.stringify(file.filename.replace(/\..+/,''))}, (_exports, require, module) => _exports[${JSON.stringify(file.filename.replace(/\..+/,''))}] = exports[${JSON.stringify(file.filename.replace(/\..+/,''))}])`
						+ `<`+`/script>`
					)
					.join('')

				+ this.editor.args.files
					.filter(file=>file.type === 'text/css')
					.map(file=>`<`+`style type = "${file.type}">${file.editor.args.value}<`+`/style>`)
					.join('')

				+ this.editor.args.files
					.filter(file=>file.type === 'application/json')
					.map(file=>`<`+`script type = "${file.type}" data-values = "${file.filename.replace(/\..*/, '')}">${file.editor.args.value}<`+`/script>`)
					.join('')

				+ '<'+'/head><'+'body></'+'body>'
				+ '<'+'/html>'
		);

		this.args.source = '';

		this.onTimeout(0, () => this.args.source = sampleHtml);

		this.editor.args.changed = false;
		this.editor.args.status  = '';

		this.onTimeout(100, () => this.editor.args.status = `Code evaluated at ${(new Date).toISOString()}.`);
	}
}
