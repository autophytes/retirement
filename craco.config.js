const WorkerLoaderPlugin = require('craco-worker-loader');

// Uses Craco to add in the worker-loader webpack plugin for imports with web workers

// TODO - EVENTUALLY - try targeting newer browsers with Babel. I believe the polyfill is slowing
//   down the web worker simulation calc in production.

module.exports = function ({ env }) {
	return {
		plugins: [
			{
				plugin: WorkerLoaderPlugin,
			},
		],
	};
};
