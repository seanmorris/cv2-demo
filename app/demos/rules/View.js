import { View as BaseView } from 'curvature/base/View';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { rawquire } from 'rawquire/rawquire.macro';

import { Editor } from '../../component/editor/Editor';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const basicSandbox     = new CurvatureFrame;
		const basicEditor      = new Editor;

		basicSandbox.editor    = basicEditor;

		this.args.basicEditor  = basicEditor;

		basicEditor.args.files = [
			{ filename: '*', label:  '*' }
			, {
				filename: 'BasicRuleView.js'
				, label:  'BasicRuleView.js'
				, value:  rawquire('./Samples/BasicRuleView.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'basic-rules-example.html'
				, label:  'basic-rules-example.html'
				, value:  rawquire('./Samples/basic-rules-example.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/basic-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: basicSandbox
			}
		];

		basicEditor.addEventListener('execute', ()=>{
			basicSandbox.buildPage();
		});

		const globalSandbox  = new CurvatureFrame;
		const globalEditor   = new Editor;

		globalSandbox.editor = globalEditor;

		globalSandbox.args.csp['connect-src'].push('https://api.dictionaryapi.dev');

		globalEditor.args.files = [
			{ filename: '*', label:  '*' }
			, {
				filename: 'GlobalRuleView.js'
				, label:  'GlobalRuleView.js'
				, value:  rawquire('./Samples/GlobalRuleView.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'global-rules-example.html'
				, label:  'global-rules-example.html'
				, value:  rawquire('./Samples/global-rules-example.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/global-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: globalSandbox
			}
		];

		this.args.globalEditor  = globalEditor;

		globalEditor.addEventListener('execute', ()=>{
			globalSandbox.buildPage();
		});

		const preprocSandbox  = new CurvatureFrame;
		const preprocEditor   = new Editor;

		preprocSandbox.editor = preprocEditor;

		preprocEditor.args.files = [
			{ filename: '*', label:  '*' }
			, {
				filename: 'PreprocessRulesExample.js'
				, label:  'PreprocessRulesExample.js'
				, value:  rawquire('./Samples/PreprocessRulesExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'preprocess-example.html'
				, label:  'preprocess-example.html'
				, value:  rawquire('./Samples/preprocess-example.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/preprocess-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: preprocSandbox
			}
		];

		this.args.preprocSandbox = preprocSandbox;
		this.args.preprocEditor  = preprocEditor;

		preprocEditor.addEventListener('execute', ()=>{
			preprocSandbox.buildPage();
		});

		const tagMappingSandbox = new CurvatureFrame;
		const tagMappingEditor  = new Editor;

		tagMappingSandbox.editor = tagMappingEditor;

		tagMappingEditor.args.files = [
			{ filename: '*', label:  '*' }
			, {
				filename: 'TagMappingExample.js'
				, label:  'TagMappingExample.js'
				, value:  rawquire('./Samples/TagMappingExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'tag-mapping-example.html'
				, label:  'tag-mapping-example.html'
				, value:  rawquire('./Samples/tag-mapping-example.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/tag-mapping-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: tagMappingSandbox
			}
		];

		tagMappingEditor.addEventListener('execute', ()=>{
			tagMappingSandbox.buildPage();
		});

		this.args.tagMappingSandbox = tagMappingSandbox;
		this.args.tagMappingEditor  = tagMappingEditor;

		const viewMappingSandbox = new CurvatureFrame;
		const viewMappingEditor  = new Editor;

		viewMappingSandbox.editor = viewMappingEditor;

		viewMappingEditor.args.files = [
			{ filename: '*', label:  '*' }
			, {
				filename: 'ViewMappingExample.js'
				, label:  'ViewMappingExample.js'
				, value:  rawquire('./Samples/ViewMappingExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'view-mapping-example.html'
				, label:  'view-mapping-example.html'
				, value:  rawquire('./Samples/view-mapping-example.html')
				, type:   'text/html'
			}
			, {
				filename: 'initialize.js'
				, label:  'initialize.js'
				, value:  rawquire('./Samples/view-mapping-initialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: viewMappingSandbox
			}
		];

		viewMappingEditor.addEventListener('execute', ()=>{
			viewMappingSandbox.buildPage();
		});

		this.args.viewMappingSandbox = viewMappingSandbox;
		this.args.viewMappingEditor  = viewMappingEditor;

		// const viewMapper = new Editor;
		// viewMapper.args.files = [
		// 	{ filename: '*', label:  '*' }
		// 	, {
		// 		filename: 'DemoView.js'
		// 		, label:  'DemoView.js'
		// 		, value:  require('./Samples/ViewMapper.jss')
		// 		, type:   'application/javascript'
		// 	}
		// 	, {
		// 		filename: 'template.html'
		// 		, label:  'template.html'
		// 		, value:  require('./Samples/ViewMapper.html')
		// 		, type:   'text/html'
		// 	}
		// ];
		// this.args.viewMapper = viewMapper;
	}
}
