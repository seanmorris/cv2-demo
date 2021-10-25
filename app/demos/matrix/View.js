import { View as BaseView } from 'curvature/base/View';

import { CurvatureFrame } from '../../control/CurvatureFrame';
import { Editor   } from '../../component/editor/Editor';
import { rawquire } from 'rawquire/rawquire.macro';

import { Matrix } from 'matrix-api/Matrix';

export class View extends BaseView
{
	template = require('./template.html');

	matrix = new Matrix;

	constructor(args,parent)
	{
		super(args,parent);

		this.args.loggedIn = false;

		this.matrix.addEventListener('logged-in', event => {
			this.args.loggedIn = true;
		});

		const editor  = this.args.editor = new Editor;

		const allFiles = {filename: '*', label:  '*'};

		const viewSource = {
			filename: 'View.js'
			, label:  'matrix/View.js'
			, value:  rawquire('./View.js')
			, type:   'application/javascript'
		};

		const templateSource = {
			filename: 'template.html'
			, label:  'matrix/template.html'
			, value:  rawquire('./template.html')
			, type:   'text/html'
		};

		editor.args.files = [allFiles, viewSource, templateSource];
	}

	login()
	{
		this.matrix.initSso(location.origin + '/accept-sso');
	}
}
