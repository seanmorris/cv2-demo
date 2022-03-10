exports.watcher = { awaitWriteFinish: true };
exports.paths   = { public: './docs' };

exports.modules = { autoRequire: {
	'notify-service.js': ['notify-service']
	, 'app.js':          ['initialize']
}};

exports.files   = {
	stylesheets:   { joinTo: 'app.css' }
	, templates:   { joinTo: 'templates.js' }
	, javascripts: {
		entryPoints: {
			'app/notify-service.js': 'notify-service.js'
			, 'app/initialize.js':   'app.js'
		}
		, joinTo: {
			'curvature.js': /node_modules\/curvature\//
			, 'vendor.js':  /node_modules\/((?!curvature).)+\//
		}
	}
};

exports.plugins = {

	babel: {
		presets: ['@babel/preset-env', ['minify', {builtIns: false}]],
		plugins: ["@babel/plugin-proposal-class-properties", "macros"]
	},

	preval: {
		tokens: {
			BUILD_TIME:  ()=> (new Date).getTime() / 1000
			, BUILD_TAG: 'notag'
		}
		, log: true
	},

	raw: {
		pattern: /\.(html|php|tmp|svg|json)/,
		wrapper: content => `module.exports = ${JSON.stringify(content)}`
	}

};

exports.npm = {
	styles: {
		codemirror: [ "lib/codemirror.css", "theme/elegant.css", ]
	}
};
