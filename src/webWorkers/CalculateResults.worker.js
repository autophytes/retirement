// For an example of how we can use web workers. Webpack already configured. Doesn't work with Draft.
//   https://willowtreeapps.com/ideas/improving-web-app-performance-with-web-worker
// import ExampleWorker from '../../webWorkers/exampleWorker';

// Idea - generate all gaussian returns up front. This iwould be 10k arrays of 40 numbers
// Array.from({length: 40}, () => Array.from({length: 10000}, () => pickGaussianNumber));
// Invert, 10k first

import gaussian from 'gaussian';
import { generateResults } from '../modules/retirement/retirementFunctions';

onmessage = (e) => {
	// const gaussian = require('gaussian');

	// console.time('webWorker preloading: ');

	if (e.data) {
		console.log('webWorker internal e.data:', e.data);

		console.time('calculating 10000x results');

		// Pre-generate the gaussian distribution objects
		const { preRetirementReturn, postRetirementReturn } = e.data.selected;
		const preDistributionObj = gaussian(preRetirementReturn, 0.12 ** 2);
		const postDistribtionObj = gaussian(postRetirementReturn, 0.12 ** 2);

		// Generate the 10,000 scenarios
		let results = [];
		for (let i = 0; i < 10000; i++) {
			results.push(
				generateResults(
					e.data.profile,
					e.data.selected,
					true, // isSimulationResults
					preDistributionObj,
					postDistribtionObj
				)
			);
		}

		// NOTE - taking forever to actually return the results. Need to just return aggregated results.
		// TODO Not bad if just arrays of values. Maybe analyze results here, also pass array of values?

		console.timeEnd('calculating 10000x results');

		// Do the work in here, and postMessage the data you want to send back
		postMessage({ results });
	} else {
		postMessage('No data');
	}
};

// export default self;
