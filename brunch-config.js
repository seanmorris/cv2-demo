const { exec } = require('child_process');

exports.files = {

	javascripts: {
		joinTo: {
			'app.js': /(app\/)/
			, 'curvature.js': /node_modules\/curvature\//
			, 'vendor.js': /node_modules\/((?!curvature).)+\//
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
		pattern: /\.(html|php|tmp|svg|json)/,
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

// exports.hooks = {
// 	preCompile: () => {
// 		console.log('About to compile...');
// 		exec(
// 			`cd ../curvature-2 && npm link && cd ../cv2-playground && npm link curvature`
// 			+ ` && cd ../cv2-hyperscroll && npm link && cd ../cv2-playground && npm link cv2-hyperscroll`
// 			, (err, stdout, stderr)=>{
// 				console.log(err);
// 				console.log(stdout);
// 				console.log(stderr);

// 				return Promise.resolve();
// 			}
// 		)
// 	}
// };
