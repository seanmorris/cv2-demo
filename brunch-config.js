exports.files = {

	javascripts: {
		joinTo: {
			'app.js': /app\/*/
			, 'curvature.js': /node_modules\/curvature\/.+/
			, 'vendor.js': /node_modules\/((?!curvature).)+\/.+?/
		}
	},

	stylesheets: {
		joinTo: 'app.css'
	}

};

exports.paths = {
	public: './docs'
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
		pattern: /\.(jss|html|php|tmp|svg)/,
		wrapper: content => `module.exports = ${JSON.stringify(content)}`
	}
};

exports.watcher = { awaitWriteFinish: true };
exports.npm = {
	styles: {
		codemirror: [
			"lib/codemirror.css",
			"theme/elegant.css",
		]
	}
};
