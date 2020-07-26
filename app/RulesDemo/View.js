import { View as BaseView } from 'curvature/base/View';

import { View as Editor } from '../Editor/View';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		this.args.list = [1,2,3];

		const basic = new Editor;

		basic.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/BasicRule.jss')
			, mode: 'ace/mode/javascript'
		};

		basic.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/BasicRule.html')
			, mode: 'ace/mode/html'
		};

		basic.refreshCode();

		this.args.basic = basic;

		const preproc = new Editor;

		preproc.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Preproc.jss')
			, mode: 'ace/mode/javascript'
		};

		preproc.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Preproc.html')
			, mode: 'ace/mode/html'
		};

		preproc.refreshCode();

		this.args.preproc = preproc;

		const mapper = new Editor;

		mapper.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Mapper.jss')
			, mode: 'ace/mode/javascript'
		};

		mapper.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Mapper.html')
			, mode: 'ace/mode/html'
		};

		mapper.refreshCode();

		this.args.mapper = mapper;

		const viewMapper = new Editor;

		viewMapper.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/ViewMapper.jss')
			, mode: 'ace/mode/javascript'
		};

		viewMapper.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/ViewMapper.html')
			, mode: 'ace/mode/html'
		};

		viewMapper.refreshCode();

		this.args.viewMapper = viewMapper;

		const globalRules = new Editor;

		globalRules.args.tabs.js   = {
			title:  'js'
			, file: 'DemoView.js'
			, body: require('./Samples/Static.jss')
			, mode: 'ace/mode/javascript'
		};

		globalRules.args.tabs.html = {
			title:  'html'
			, file: 'template.html'
			, body: require('./Samples/Static.html')
			, mode: 'ace/mode/html'
		};

		globalRules.refreshCode();

		this.args.globalRules = globalRules;
	}
}
