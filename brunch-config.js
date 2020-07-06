exports.files = {
  javascripts: {joinTo: 'app.js'},
  stylesheets: {joinTo: 'app.css'}
};

exports.hooks  = {};

exports.plugins = {
  babel: {presets: ['@babel/preset-env']},
  raw: {
	pattern: /\.(html|tmp\.+?)$/,
	wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.watcher = {
	awaitWriteFinish: true,
	usePolling: true
};
