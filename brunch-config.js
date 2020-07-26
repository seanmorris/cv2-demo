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
  babel: {presets: ['@babel/preset-env']},
  raw: {
	pattern: /\.(jss|html|php|tmp\.+?)$/,
	wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.watcher = {
	awaitWriteFinish: true,
	usePolling: true
};
