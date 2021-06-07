// For an example of how we can use web workers. Webpack already configured. Doesn't work with Draft.
//   https://willowtreeapps.com/ideas/improving-web-app-performance-with-web-worker
// import ExampleWorker from '../../webWorkers/exampleWorker';

// Idea - generate all gaussian returns up front. This iwould be 10k arrays of 40 numbers
// Array.from({length: 40}, () => Array.from({length: 10000}, () => pickGaussianNumber));
// Invert, 10k first

import gaussian from 'gaussian';
import { generateResults } from '../modules/retirement/retirementFunctions';

onmessage = (e) => {
	if (e.data) {
		console.time('calculating 10000x results');

		// Pre-generate the gaussian distribution objects
		const { preRetirementReturn, postRetirementReturn } = e.data.selected;
		const preDistributionObj = gaussian(preRetirementReturn, 0.12 ** 2);
		const postDistribtionObj = gaussian(postRetirementReturn, 0.12 ** 2);

		// Generate the 10,000 scenarios
		let results = [];
		let returns = [];
		for (let i = 0; i < 10000; i++) {
			const newResults = generateResults(
				e.data.profile,
				e.data.selected,
				true, // isSimulationResults
				preDistributionObj,
				postDistribtionObj
			);

			results.push(newResults.results);
			returns.push(newResults.returns);
		}

		let bandsArray = [];

		// Loop through the values for each year
		for (let year = 0; year < results[0].length; year++) {
			const yearSum = results.reduce((sum, yearResult) => sum + yearResult[year], 0);
			const average = yearSum / results.length;

			// Standard Deviation
			const stdevCalcSum = results.reduce(
				(sum, yearResult) => (yearResult[year] - average) ** 2 + sum,
				0
			);
			const stdev = Math.sqrt(stdevCalcSum / results.length);

			// Survival Percentage
			const survivedCount = results.reduce(
				(sum, yearResult) => (yearResult[year] > 0 ? sum + 1 : sum),
				0
			);
			const percentSurvived = survivedCount / results.length;

			bandsArray.push([average + stdev, average - stdev, percentSurvived]);
		}

		// Calculate the average number of negative years
		const totalNegativeYears = returns.reduce(
			(acc, yearArray) =>
				yearArray.reduce((count, item) => (item < 0 ? count + 1 : count), 0) + acc,
			0
		);
		const avgNegativeYears = totalNegativeYears / returns.length;
		console.log('avgNegativeYears:', avgNegativeYears);

		console.timeEnd('calculating 10000x results');

		// Do the work in here, and postMessage the data you want to send back
		postMessage({
			results: bandsArray,
			cacheKey: e.data.cacheKey,
			avgNegativeYears: avgNegativeYears,
		});
	} else {
		postMessage('No data');
	}
};

// export default self;
