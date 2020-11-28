import { Tag } from 'curvature/base/Tag';
import { View as BaseView } from 'curvature/base/View';

import { FormEditor as EditorView } from './FormEditor';

import { CurvatureFrame } from '../control/CurvatureFrame';

import { Editor   } from '../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

import * as ace from 'brace';

import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

import { Form } from 'curvature/form/Form';

export class View extends BaseView
{
	constructor()
	{
		super();

		this.template = require('./template');

		const formValueStyle = {
			whiteSpace:'pre'
			, position: 'absolute'
			, top: '0px'
			, left: '0px'
			, fontSize: '0.75rem'
			, padding: '0.5em'
			, overflow: 'auto'
			, height: '100%'
			, width: '100%'
		};

		/**********/

		this.args.basicFormEditor = new Editor;

		const basicFormFrame = new CurvatureFrame;
		const basicFormValue = new Tag('<div>');

		basicFormValue.style(formValueStyle);

		basicFormFrame.addEventListener('SandboxMessage', event => {
			basicFormValue.innerText = event.detail.data;
		});

		this.args.basicFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'BasicFormExample.js'
				, label:  'BasicFormExample.js'
				, value:  rawquire('./Samples/BasicFormExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'BasicFormInitialize.js'
				, label:  'BasicFormInitialize.js'
				, value:  rawquire('./Samples/BasicFormInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'basic-form-template.html'
				, label:  'basic-form-template.html'
				, value:  rawquire('./Samples/basic-form-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: basicFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: basicFormValue
			}
		];

		/**********/

		this.args.groupFormEditor = new Editor;

		const groupFormFrame = new CurvatureFrame;
		const groupFormValue = new Tag('<div>');

		groupFormValue.style(formValueStyle);

		groupFormFrame.addEventListener('SandboxMessage', event => {
			groupFormValue.innerText = event.detail.data;
		});

		this.args.groupFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'FieldGroupExample.js'
				, label:  'FieldGroupExample.js'
				, value:  rawquire('./Samples/FieldGroupExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'FieldGroupInitialize.js'
				, label:  'FieldGroupInitialize.js'
				, value:  rawquire('./Samples/FieldGroupInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'field-group-template.html'
				, label:  'field-group-template.html'
				, value:  rawquire('./Samples/field-group-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: groupFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: groupFormValue
			}
		];

		/**********/

		this.args.textfieldFormEditor = new Editor;

		const textfieldFormFrame = new CurvatureFrame;
		const textfieldFormValue = new Tag('<div>');

		textfieldFormValue.style(formValueStyle);

		textfieldFormFrame.addEventListener('SandboxMessage', event => {
			textfieldFormValue.innerText = event.detail.data;
		});

		this.args.textfieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'TextFieldExample.js'
				, label:  'TextFieldExample.js'
				, value:  rawquire('./Samples/TextFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'TextFieldInitialize.js'
				, label:  'TextFieldInitialize.js'
				, value:  rawquire('./Samples/TextFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'text-field-template.html'
				, label:  'text-field-template.html'
				, value:  rawquire('./Samples/text-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: textfieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: textfieldFormValue
			}
		];

		/**********/

		this.args.textareafieldFormEditor = new Editor;

		const textareafieldFormFrame = new CurvatureFrame;
		const textareafieldFormValue = new Tag('<div>');

		textareafieldFormValue.style(formValueStyle);

		textareafieldFormFrame.addEventListener('SandboxMessage', event => {
			textareafieldFormValue.innerText = event.detail.data;
		});

		this.args.textareafieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'TextareaFieldExample.js'
				, label:  'TextareaFieldExample.js'
				, value:  rawquire('./Samples/TextareaFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'TextareaFieldInitialize.js'
				, label:  'TextareaFieldInitialize.js'
				, value:  rawquire('./Samples/TextareaFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'textarea-field-template.html'
				, label:  'textarea-field-template.html'
				, value:  rawquire('./Samples/textarea-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: textareafieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: textareafieldFormValue
			}
		];

		/**********/

		this.args.filefieldFormEditor = new Editor;

		const filefieldFormFrame = new CurvatureFrame;
		const filefieldFormValue = new Tag('<div>');

		filefieldFormValue.style(formValueStyle);

		filefieldFormFrame.addEventListener('SandboxMessage', event => {
			filefieldFormValue.innerText = event.detail.data;
		});

		this.args.filefieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'FileFieldExample.js'
				, label:  'FileFieldExample.js'
				, value:  rawquire('./Samples/FileFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'FileFieldInitialize.js'
				, label:  'FileFieldInitialize.js'
				, value:  rawquire('./Samples/FileFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'file-field-template.html'
				, label:  'file-field-template.html'
				, value:  rawquire('./Samples/file-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: filefieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: filefieldFormValue
			}
		];

		/**********/

		this.args.submitfieldFormEditor = new Editor;

		const submitfieldFormFrame = new CurvatureFrame;
		const submitfieldFormValue = new Tag('<div>');

		submitfieldFormValue.style(formValueStyle);

		submitfieldFormFrame.addEventListener('SandboxMessage', event => {
			submitfieldFormValue.innerText = event.detail.data;
		});

		this.args.submitfieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'SubmitFieldExample.js'
				, label:  'SubmitFieldExample.js'
				, value:  rawquire('./Samples/SubmitFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'SubmitFieldInitialize.js'
				, label:  'SubmitFieldInitialize.js'
				, value:  rawquire('./Samples/SubmitFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'submit-field-template.html'
				, label:  'submit-field-template.html'
				, value:  rawquire('./Samples/submit-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: submitfieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: submitfieldFormValue
			}
		];

		/**********/

		this.args.buttonfieldFormEditor = new Editor;

		const buttonfieldFormFrame = new CurvatureFrame;
		const buttonfieldFormValue = new Tag('<div>');

		buttonfieldFormValue.style(formValueStyle);

		buttonfieldFormFrame.addEventListener('SandboxMessage', event => {
			buttonfieldFormValue.innerText = event.detail.data;
		});

		this.args.buttonfieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'ButtonFieldExample.js'
				, label:  'ButtonFieldExample.js'
				, value:  rawquire('./Samples/ButtonFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'ButtonFieldInitialize.js'
				, label:  'ButtonFieldInitialize.js'
				, value:  rawquire('./Samples/ButtonFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'button-field-template.html'
				, label:  'button-field-template.html'
				, value:  rawquire('./Samples/button-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: buttonfieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: buttonfieldFormValue
			}
		];

		/**********/

		this.args.checkboxfieldFormEditor = new Editor;

		const checkboxfieldFormFrame = new CurvatureFrame;
		const checkboxfieldFormValue = new Tag('<div>');

		checkboxfieldFormValue.style(formValueStyle);

		checkboxfieldFormFrame.addEventListener('SandboxMessage', event => {
			checkboxfieldFormValue.innerText = event.detail.data;
		});

		this.args.checkboxfieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'CheckboxFieldExample.js'
				, label:  'CheckboxFieldExample.js'
				, value:  rawquire('./Samples/CheckboxFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'CheckboxFieldInitialize.js'
				, label:  'CheckboxFieldInitialize.js'
				, value:  rawquire('./Samples/CheckboxFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'checkbox-field-template.html'
				, label:  'checkbox-field-template.html'
				, value:  rawquire('./Samples/checkbox-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: checkboxfieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: checkboxfieldFormValue
			}
		];

		/**********/

		this.args.selectfieldFormEditor = new Editor;

		const selectfieldFormFrame = new CurvatureFrame;
		const selectfieldFormValue = new Tag('<div>');

		selectfieldFormValue.style(formValueStyle);

		selectfieldFormFrame.addEventListener('SandboxMessage', event => {
			selectfieldFormValue.innerText = event.detail.data;
		});

		this.args.selectfieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'SelectFieldExample.js'
				, label:  'SelectFieldExample.js'
				, value:  rawquire('./Samples/SelectFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'SelectFieldInitialize.js'
				, label:  'SelectFieldInitialize.js'
				, value:  rawquire('./Samples/SelectFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'select-field-template.html'
				, label:  'select-field-template.html'
				, value:  rawquire('./Samples/select-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: selectfieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: selectfieldFormValue
			}
		];

		/**********/

		this.args.radiofieldFormEditor = new Editor;

		const radiofieldFormFrame = new CurvatureFrame;
		const radiofieldFormValue = new Tag('<div>');

		radiofieldFormValue.style(formValueStyle);

		radiofieldFormFrame.addEventListener('SandboxMessage', event => {
			radiofieldFormValue.innerText = event.detail.data;
		});

		this.args.radiofieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'RadioFieldExample.js'
				, label:  'RadioFieldExample.js'
				, value:  rawquire('./Samples/RadioFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'RadioFieldInitialize.js'
				, label:  'RadioFieldInitialize.js'
				, value:  rawquire('./Samples/RadioFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'radio-field-template.html'
				, label:  'radio-field-template.html'
				, value:  rawquire('./Samples/radio-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: radiofieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: radiofieldFormValue
			}
		];

		/**********/

		this.args.hiddenfieldFormEditor = new Editor;

		const hiddenfieldFormFrame = new CurvatureFrame;
		const hiddenfieldFormValue = new Tag('<div>');

		hiddenfieldFormValue.style(formValueStyle);

		hiddenfieldFormFrame.addEventListener('SandboxMessage', event => {
			hiddenfieldFormValue.innerText = event.detail.data;
		});

		this.args.hiddenfieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'HiddenFieldExample.js'
				, label:  'HiddenFieldExample.js'
				, value:  rawquire('./Samples/HiddenFieldExample.js')
				, type:   'application/javascript'

			}
			, {
				filename: 'HiddenFieldInitialize.js'
				, label:  'HiddenFieldInitialize.js'
				, value:  rawquire('./Samples/HiddenFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'hidden-field-template.html'
				, label:  'hidden-field-template.html'
				, value:  rawquire('./Samples/hidden-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: hiddenfieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: hiddenfieldFormValue
			}
		];

		/**********/

		this.args.htmlfieldFormEditor = new Editor;

		const htmlfieldFormFrame = new CurvatureFrame;
		const htmlfieldFormValue = new Tag('<div>');

		htmlfieldFormValue.style(formValueStyle);

		htmlfieldFormFrame.addEventListener('SandboxMessage', event => {
			htmlfieldFormValue.innerText = event.detail.data;
		});

		this.args.htmlfieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'HtmlFieldExample.js'
				, label:  'HtmlFieldExample.js'
				, value:  rawquire('./Samples/HtmlFieldExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'HtmlFieldInitialize.js'
				, label:  'HtmlFieldInitialize.js'
				, value:  rawquire('./Samples/HtmlFieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'html-field-template.html'
				, label:  'html-field-template.html'
				, value:  rawquire('./Samples/html-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: htmlfieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: htmlfieldFormValue
			}
		];

		/**********/

		this.args.html5fieldFormEditor = new Editor;

		const html5fieldFormFrame = new CurvatureFrame;
		const html5fieldFormValue = new Tag('<div>');

		html5fieldFormValue.style(formValueStyle);

		html5fieldFormFrame.addEventListener('SandboxMessage', event => {
			html5fieldFormValue.innerText = event.detail.data;
		});

		this.args.html5fieldFormEditor.args.files = [
			{
				filename: '*'
				, label:  '*'
			}
			, {
				filename: 'Html5FieldExample.js'
				, label:  'Html5FieldExample.js'
				, value:  rawquire('./Samples/Html5FieldExample.js')
				, type:   'application/javascript'
			}
			, {
				filename: 'Html5FieldInitialize.js'
				, label:  'Html5FieldInitialize.js'
				, value:  rawquire('./Samples/Html5FieldInitialize.js')
				, type:   'application/javascript'
				, hide:   true
			}
			, {
				filename: 'html5-field-template.html'
				, label:  'html5-field-template.html'
				, value:  rawquire('./Samples/html5-field-template.html')
				, type:   'text/html'
			}
			, {
				filename: 'result'
				, label:  'result'
				, control: html5fieldFormFrame
			}
			, {
				filename: 'form value'
				, label:  'form value'
				, control: html5fieldFormValue
			}
		];
	}

	postRender()
	{

	}

	toJson(input)
	{
		return JSON.stringify(input, null, 2);
	}
}
