import { Router }  from 'curvature/base/Router'
import { RuleSet } from 'curvature/base/RuleSet'
import { View }    from 'curvature/base/View';

export class WildcardExampleLayout extends View
{
	constructor(args, parent)
	{
		super(args, parent);

		this.args.content = 'loading...';
		this.args.path    = '/';
		this.args.links   = {
			index: '/'
			, 'page a':     '/page/a'
			, 'page b':     '/page/b'
			, 'page c':     '/page/c'
			, 'optional':   '/optional'
			, 'optional x': '/optional/x'
			, 'variadic 0': '/variadic'
			, 'variadic 1': '/variadic/1'
			, 'variadic 2': '/variadic/1/2'
			, 'variadic 3': '/variadic/1/2/3'
		};

		this.template = `<div class = "urlBar"><label><small>url:</small><input cv-bind = "path" cv-on = "keyup:go"></label><button cv-on = "click:go">go</button></div>
		<nav cv-each = "links:link:label" style = "margin-bottom: 1em;">
			<span><a cv-link = "[[link]]">[[label]]</a></span>
		</nav>
		[[content]]
		<div class = "status">[[fakeStatus]]</div>
			<style>
			body {margin-top: 2.25rem;}
			pre:first-line {font-weight:bold;}
			nav span { margin-right: 1em; }
			.urlBar label {
				margin-left: 0.25rem;
				align-items: center;
				display:flex;
				flex:1;
			}
			.urlBar input {
				margin-left: 0.25rem;
				border:none;
				border-radius:0;
				flex:1;
			}
			.urlBar > *, .urlBar input { height: 2rem; box-sizing: border-box; }
			.urlBar button {
				background: black;
				color: white;
				border:none;
				display: inline-block;
				align-items: center;
				font-size: 0.75rem;
			}
			.urlBar {
				position:fixed;
				background: white;
				top:0;
				left:0;
				display:flex;
				margin-bottom:1rem;
				width:100%;
				border-bottom:1px solid black;
				align-items: center;
			}
			.status:empty { display: none; }
			.status {
				position:absolute;
				bottom:0;
				left:0;
				color:white;
				background:black;
				padding: 0.15rem;
			}
		</style>`;

		document.addEventListener('cvRouteEnd', event => this.args.path = '/' + event.detail.path.join('/'));

		RuleSet.add('a', tag => {
			tag.addEventListener('mouseover', () => this.args.fakeStatus = tag.getAttribute('href'));
			tag.addEventListener('mouseout',  () => this.args.fakeStatus = '');
		});
	}

	go(event)
	{
		if(event.key && event.key !== 'Enter')
		{
			return;
		}

		Router.go(this.args.path);
	}
}

