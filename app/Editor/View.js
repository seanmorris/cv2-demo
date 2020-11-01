import { View as BaseView } from 'curvature/base/View';
import { Keyboard } from 'curvature/input/Keyboard';

import { View as ArrayView } from '../ArrayDemo/View';
import { View as ObjectView } from '../ObjectDemo/View';

import * as ace from 'brace';

import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.multi = false;

		const kbDebind = Keyboard.get().keys.bindTo('Control', v => {

			this.multi = v > 0;

			this.args.multiselect = this.multi
				? 'multiselect'
				: 'select';

		});

		this.onRemove(kbDebind);

		this.template = require('./template');

		this.args.showJs     = true;
		this.args.showHtml   = true;
		this.args.showResult = true;

		this.args.location = location;

		this.args.orientation = this.args.orientation || 'vertical'; //'horizontal';

		this.args.tabs       = {};
		this.args.resultTabs = {};

		this.args.tabs.bindTo((v,k) => v.name = k);
		this.args.resultTabs.bindTo((v,k) => v.name = k);

		this.args.time = (new Date).toISOString();

		this.onFrame(() => {
			this.args.time = (new Date).toISOString();
		});

		this.args.showClasses = ['showSplit'];

		this.args.showSplit = 'active';

		this.args.frameSource = '...';
	}

	postRender(x)
	{
		this.tags.edit = {};
		this.editors   = {};

		const frame = this.tags.result.element;

		this.tags.edit.bindTo((tag, prop) => {
			if(!tag || this.editors[prop])
			{
				return;
			}

			const tab = this.args.tabs[prop] || this.args.resultTabs[prop];

			const editor = ace.edit(tag.element);

			this.editors[prop] = editor;

			editor.setValue(tab.body || '', -1);

			editor.session.setMode(tab.mode || 'ace/mode/javascript');
			editor.setTheme('ace/theme/monokai');
			editor.setOptions({
				autoScrollEditorIntoView: true
				, printMargin: false
				, readOnly: tab.readonly || false
				// , scrollbarWidth: 6
			});

			const aceChanged = (newValue) => {

				if(tab.readonly)
				{
					return;
				}

				tab.body = editor.getValue();

				this.args.editorStatus  = `Code updated at ${(new Date).toISOString()}`
				this.args.editorRefresh = 'refresh-enabled';
			};

			editor.session.on('change', aceChanged);

			this.onRemove(()=>{
				editor.session.off('change', aceChanged);
				editor.destroy();
				delete this.editors[prop];
			});

			tab.bindTo('body', v => {

				if(!tab.readonly)
				{
					return;
				}

				editor.setValue(v, -1);

				if(tab.readonly)
				{
					return;
				}

				this.refreshCode();
			});

			editor.resize();

		});
	}

	attached()
	{
	}

	frameLoaded(event)
	{
	}

	refreshCode(event)
	{
		let resultTemplate = require('./results');

		resultTemplate =resultTemplate.replace(
			/\[ORIGIN\]/g, location.origin
		);

		const js   = this.args.tabs.js
			? this.args.tabs.js.body
			: '';

		const html = this.args.tabs.html
			? this.args.tabs.html.body
			: '';

		const css  = this.args.tabs.css
			? this.args.tabs.css.body
			: '';

		resultTemplate =resultTemplate.replace(
			/\[SCRIPT\]/g, js
		);

		resultTemplate =resultTemplate.replace(
			/\[TEMPLATE\]/g, html
		);

		resultTemplate =resultTemplate.replace(
			/\[STYLE\]/g, css
		);

		this.args.frameSource = resultTemplate;

		this.args.editorStatus  = `Last ran at ${(new Date).toISOString()}`
		this.args.editorRefresh = 'refresh-disabled';
	}

	showResult()
	{
		if(this.args.showSplit)
		{
			for(const tabName in this.args.tabs)
			{
				const tab = this.args.tabs[tabName];
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;

				tab.active = '';

				tag.classList.add('hide');
			}

			for(const tabName in this.args.resultTabs)
			{
				const tab = this.args.resultTabs[tabName];
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;

				tab.active = '';

				tag.classList.add('hide');
			}

			this.hideResult();
		}

		if(!this.multi)
		{
			for(const tabName in this.args.tabs)
			{
				const tab = this.args.tabs[tabName];
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;

				tab.active = '';

				tag.classList.add('hide');
			}

			for(const tabName in this.args.resultTabs)
			{
				const tab = this.args.resultTabs[tabName];
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;

				tab.active = '';

				tag.classList.add('hide');
			}


		}

		if(this.multi
			&& this.args.showResult
			&& this.args.showResult !== 'hide'
		){
			this.args.showSplit = '';
			this.args.showResult = 'hide';
		}
		else
		{
			this.args.showSplit  = '';
			this.args.showResult = 'active';
		}

		for(const tab in this.args.tabs)
		{
			this.editors[tab].resize();
			this.args[tab] = true;
		}
	}

	hideResult()
	{
		this.args.showSplit  = 'hide';
		this.args.showResult = 'hide';
	}

	showTab(...tabs)
	{
		if(!this.multi || !tabs.length)
		{
			for(const tabName in this.args.tabs)
			{
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;

				const tab = this.args.tabs[tabName];

				tab.active = '';

				tag.classList.add('hide');
			}

			for(const tabName in this.args.resultTabs)
			{
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;

				const tab = this.args.resultTabs[tabName];

				tab.active = '';

				tag.classList.add('hide');
			}
		}

		this.args.showClasses = [];

		if(!tabs.length)
		{
			this.args.showResult = '';
			this.args.showSplit  = 'active';

			for(const tabName in this.args.tabs)
			{
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;
				const tab = this.args.tabs[tabName];

				tag.classList.remove('hide');
			}

			for(const tabName in this.args.resultTabs)
			{
				const tag = this.tags.edit[tabName].element.parentNode.parentNode;
				const tab = this.args.resultTabs[tabName];

				tag.classList.remove('hide');
			}

			this.args.showClasses = ['showSplit'];
		}
		else
		{
			if(this.args.showSplit)
			{
				for(const tabName in this.args.tabs)
				{
					const tag = this.tags.edit[tabName].element.parentNode.parentNode;

					const tab = this.args.tabs[tabName];

					tab.active = '';

					tag.classList.add('hide');
				}

				for(const tabName in this.args.resultTabs)
				{
					const tag = this.tags.edit[tabName].element.parentNode.parentNode;

					const tab = this.args.resultTabs[tabName];

					tab.active = '';

					tag.classList.add('hide');
				}

				this.hideResult();
			}

			if(!this.multi)
			{
				this.hideResult();
			}

			this.args.showClasses = [];
			this.args.showSplit = '';
		}

		for(const tab of tabs)
		{
			const tag = this.tags.edit[tab.name].element.parentNode.parentNode;

			if(tab.active)
			{
				tab.active = '';
				tag.classList.add('hide');
			}
			else
			{
				tab.active = 'active';
				tag.classList.remove('hide');
			}

		}

		for(const tab of tabs)
		{
			this.editors[tab.name].resize();
			this.args[tab.name] = true;
		}
	}

	changeOrientation()
	{
		this.args.orientation = this.args.orientation == 'horizontal'
			? 'vertical'
			: 'horizontal';

		this.resizeEditor();
	}

	resizeEditor(event)
	{
		for(const tab in this.args.tabs)
		{
			this.editors[tab].resize();
		}
		for(const tab in this.args.resultTabs)
		{
			this.editors[tab].resize();
		}
	}

	clear(clearVar)
	{
		this.args[clearVar] = '';
	}

	joinClass(input)
	{
		return (input || []).join(' ');
	}

	expand(event)
	{
		this.args.expanded = this.args.expanded
			? ''
			: 'expanded';

		if(this.args.expanded)
		{
			document.body.classList.add('no-scroll');

		}
		else
		{
			document.body.classList.remove('no-scroll');

		}

		this.resizeEditor(event);
	}

	escapeQuotes(input)
	{
		return String(input).replace(/"/g, '&quot;');
	}
}
