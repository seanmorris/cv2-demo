import { View as BaseView } from 'curvature/base/View';

import { SandboxFrame } from '../control/SandboxFrame';
import { CurvatureFrame } from '../control/CurvatureFrame';

import { rawquire } from 'rawquire/rawquire.macro';

import { Editor } from '../component/editor/Editor';

export class View extends BaseView
{
	constructor(args, parent)
	{
		super(args, parent)

		this.template = require('./template');

		/**/

		const routeEditor   = new Editor({},this);
		const routeSandbox  = new CurvatureFrame;
		routeSandbox.editor = routeEditor;

		routeEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'RouterExampleLayout.js'
				, label:  'RouterExampleLayout.js'
				, value:   rawquire('./sample/RouterExampleLayout.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'router-example-initialize.js'
				, label:  'router-example-initialize.js'
				, value:  rawquire('./sample/router-example-initialize.js')
				, type:   'application/javascript'
			}
		];

		routeEditor.addEventListener('execute', ()=>{
			routeSandbox.buildPage();
		});

		this.args.routeSandbox = routeSandbox;
		this.args.routeEditor  = routeEditor;

		/**/

		const wildcardEditor  = new Editor({},this);
		const wildcardSandbox = new CurvatureFrame;

		wildcardSandbox.editor = wildcardEditor;

		wildcardEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'WildcardExampleLayout.js'
				, label:  'WildcardExampleLayout.js'
				, value:  rawquire('./sample/WildcardExampleLayout.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'wildcard-example-initialize.js'
				, label:  'wildcard-example-initialize.js'
				, value:  rawquire('./sample/wildcard-example-initialize.js')
				, type:   'application/javascript'
			}
		];

		wildcardEditor.addEventListener('execute', ()=>{
			wildcardSandbox.buildPage();
		});

		this.args.wildcardSandbox = wildcardSandbox;
		this.args.wildcardEditor  = wildcardEditor;

		/**/

		const errorEditor   = new Editor({},this);
		const errorSandbox  = new CurvatureFrame;
		errorSandbox.editor = errorEditor;

		errorEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ErrorExampleLayout.js'
				, label:  'ErrorExampleLayout.js'
				, value:   rawquire('./sample/ErrorExampleLayout.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'error-example-initialize.js'
				, label:  'error-example-initialize.js'
				, value:   rawquire('./sample/error-example-initialize.js')
				, type:   'application/javascript'
			}
		];

		errorEditor.addEventListener('execute', ()=>{
			errorSandbox.buildPage();
		});

		this.args.errorSandbox = errorSandbox;
		this.args.errorEditor  = errorEditor;
	}
}
