const WorkerLoaderPlugin = require('craco-worker-loader');

module.exports = function ({ env }) {
	return {
		plugins: [
			{
				plugin: WorkerLoaderPlugin,
			},
		],
	};
};
