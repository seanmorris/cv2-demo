import { View } from 'curvature/base/View';

import { GeoIn  } from 'curvature/animate/ease/GeoIn';
import { GeoOut } from 'curvature/animate/ease/GeoOut';

import { CubicIn  } from 'curvature/animate/ease/CubicIn';
import { CubicOut } from 'curvature/animate/ease/CubicOut';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { FakeConsole } from '../../control/FakeConsole';

import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

export class BindableDemoView extends View
{
	constructor(args = {}, parent)
	{
		super(args, parent);

		this.template  = require('./bindable-demo');

		const bindingSandbox  = new CurvatureFrame;
		const bindingEditor   = new Editor;

		const bindingOutput = new FakeConsole;

		bindingEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ConsoleProxy.js'
				, label:  'ConsoleProxy.js'
				, value:  rawquire('./sample/ConsoleProxy.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'WatchExample.js'
				, label:  'WatchExample.js'
				, value:  rawquire('./sample/WatchExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'Console'
				, label:  'Console'
				, control: bindingOutput
			}
			, {
				filename: 'iFrame'
				, label:  'iFrame'
				, control: bindingSandbox
				, hide:    true
			}
		];

		this.args.bindingEditor = bindingEditor;

		bindingSandbox.addEventListener('SandboxMessage', event => {
			const message = JSON.parse(event.detail.data);
			const type    = message.shift()
			const items   = message.map(i => JSON.stringify(i)).join(', ');

			bindingOutput.args.lines.push({type, items});
		});

		bindingEditor.addEventListener('execute', ()=>{
			bindingSandbox.buildPage();
		});

		const debindingSandbox  = new CurvatureFrame;
		const debindingEditor   = new Editor;

		const debindingOutput = new FakeConsole;

		debindingEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ConsoleProxy.js'
				, label:  'ConsoleProxy.js'
				, value:  rawquire('./sample/ConsoleProxy.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'DebindExample.js'
				, label:  'DebindExample.js'
				, value:  rawquire('./sample/DebindExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'Console'
				, label:  'Console'
				, control: debindingOutput
			}
			, {
				filename: 'iFrame'
				, label:  'iFrame'
				, control: debindingSandbox
				, hide:    true
			}
		];

		this.args.debindingEditor = debindingEditor;

		debindingSandbox.addEventListener('SandboxMessage', event => {

			const message = JSON.parse(event.detail.data);
			const type    = message.shift()
			const items   = message.map(i => JSON.stringify(i)).join(', ');

			debindingOutput.args.lines.push({type, items});

		});

		debindingEditor.addEventListener('execute', ()=>{
			debindingSandbox.buildPage();
		});

		const multibindingSandbox  = new CurvatureFrame;
		const multibindingEditor   = new Editor;

		const multibindingOutput = new FakeConsole;

		multibindingEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ConsoleProxy.js'
				, label:  'ConsoleProxy.js'
				, value:  rawquire('./sample/ConsoleProxy.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'multibindExample.js'
				, label:  'multibindExample.js'
				, value:  rawquire('./sample/MultibindExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'Console'
				, label:  'Console'
				, control: multibindingOutput
			}
			, {
				filename: 'iFrame'
				, label:  'iFrame'
				, control: multibindingSandbox
				, hide:    true
			}
		];

		this.args.multibindingEditor  = multibindingEditor;

		multibindingSandbox.addEventListener('SandboxMessage', event => {

			const message = JSON.parse(event.detail.data);
			const type    = message.shift()
			const items   = message.map(i => JSON.stringify(i)).join(', ');

			multibindingOutput.args.lines.push({type, items});

		});

		multibindingEditor.addEventListener('execute', ()=>{
			multibindingSandbox.buildPage();
		});

		const omnibindingSandbox  = new CurvatureFrame;
		const omnibindingEditor   = new Editor;

		const omnibindingOutput = new FakeConsole;

		omnibindingEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ConsoleProxy.js'
				, label:  'ConsoleProxy.js'
				, value:  rawquire('./sample/ConsoleProxy.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'ParambindExample.js'
				, label:  'ParambindExample.js'
				, value:  rawquire('./sample/OmnibindExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'Console'
				, label:  'Console'
				, control: omnibindingOutput
			}
			, {
				filename: 'iFrame'
				, label:  'iFrame'
				, control: omnibindingSandbox
				, hide:    true
			}
		];

		this.args.omnibindingEditor  = omnibindingEditor;

		omnibindingSandbox.addEventListener('SandboxMessage', event => {

			const message = JSON.parse(event.detail.data);
			const type    = message.shift()
			const items   = message.map(i => JSON.stringify(i)).join(', ');

			omnibindingOutput.args.lines.push({type, items});

		});

		omnibindingEditor.addEventListener('execute', ()=>{
			omnibindingSandbox.buildPage();
		});

		const parambindingEditor   = new Editor;
		const parambindingOutput   = new FakeConsole;
		const parambindingSandbox  = new CurvatureFrame;

		parambindingEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ConsoleProxy.js'
				, label:  'ConsoleProxy.js'
				, value:  rawquire('./sample/ConsoleProxy.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'parambindExample.js'
				, label:  'parambindExample.js'
				, value:  rawquire('./sample/ParambindExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'Console'
				, label:  'Console'
				, control: parambindingOutput
			}
			, {
				filename: 'iFrame'
				, label:  'iFrame'
				, control: parambindingSandbox
				, hide:    true
			}
		];

		this.args.parambindingEditor  = parambindingEditor;

		parambindingSandbox.addEventListener('SandboxMessage', event => {

			const message = JSON.parse(event.detail.data);
			const type    = message.shift()
			const items   = message.map(i => JSON.stringify(i)).join(', ');

			parambindingOutput.args.lines.push({type, items});

		});

		parambindingEditor.addEventListener('execute', ()=>{
			parambindingSandbox.buildPage();
		});
	}
}
