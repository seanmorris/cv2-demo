exports.files = {
  javascripts: {joinTo: {
  	'app.js': /app\/*/
  	, 'curvature.js': /node_modules\/curvature\/.+/
  	, 'vendor.js': /node_modules\/((?!curvature).)+\/.+?/
  }},
  stylesheets: {joinTo: 'app.css'}
};

exports.hooks  = {};

exports.plugins = {
  babel: {presets: ['@babel/preset-env']},
  raw: {
	pattern: /\.(jss|html|tmp\.+?)$/,
	wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.watcher = {
	awaitWriteFinish: true,
	usePolling: true
};
