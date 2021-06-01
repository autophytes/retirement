module.exports = function override(config, env) {
	// Add worker-loader by hijacking configuration for regular .js files.

	const workerExtension = /\.worker\.js$/;

	const babelLoader = config.module.rules.find(
		(rule) => rule.loader && rule.loader.indexOf('babel-loader') !== -1
	);

	const workerLoader = JSON.parse(JSON.stringify(babelLoader));

	workerLoader.test = workerExtension;
	workerLoader.use = [
		'worker-loader',
		{
			// Old babel-loader configuration goes here.
			loader: workerLoader.loader,
			options: workerLoader.options,
		},
	];
	delete workerLoader.loader;
	delete workerLoader.options;

	babelLoader.exclude = (babelLoader.exclude || []).concat([workerExtension]);

	config.module.rules.push(workerLoader);

	// Optionally output the final config to check it.
	//console.dir(config, { depth: 10, colors: true });

	return config;
};
