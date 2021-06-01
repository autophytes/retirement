import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from './../../context/appContext';

import numeral from 'numeral';
import RetirementChart from './RetirementChart';
import RetirementVariations from './RetirementVariations';
import { generateResults } from './retirementFunctions';

import CalcWorker from '../../webWorkers/CalculateResults.worker';
const worker = new CalcWorker();

const Retirement = ({ clientName }) => {
	const { profile, selected, options, updateProfile } = useContext(AppContext);

	const [savingsAtRetirementPV, setSavingsAtRetirementPV] = useState('$0');
	const [savingsAtRetirementFV, setSavingsAtRetirementFV] = useState('$0');
	const [incomeAtRetirementFV, setIncomeAtRetirementFV] = useState('$0');

	// Compute the updated projection results
	const results = useMemo(() => generateResults(profile, selected), [profile, selected]);

	// TODO
	// useEffect(() => {
	// 	console.time('calculating 10000x results');
	// 	const { preRetirementReturn, postRetirementReturn } = selected;

	// 	const preDistributionObj = gaussian(preRetirementReturn, 0.12 ** 2);
	// 	// const postDistribtionObj = gaussian(postRetirementReturn, 0.12 ** 2);

	//   // Taking 250-300ms
	// 	const newArray = Array.from({ length: 71 }, () =>
	// 		Array.from({ length: 10000 }, () => preDistributionObj.ppf(Math.random()))
	// 	);

	//   // This is taking 450-550ms
	// 	for (let i = 0; i < 10000; i++) {
	// 		generateResults(profile, selected, true, preDistributionObj, postDistribtionObj);
	// 	}

	// 	console.timeEnd('calculating 10000x results');
	// }, [profile, selected]);

	useEffect(() => {
		console.log('running test function');
		// TODO - aggregate results (find stdev and mean, show 1 stdev on each side). Do in worker.
		// Store results for each profile/selected configuration
		// Render results

		const testFunction = async () => {
			worker.onmessage = (e) => {
				// console.log('e.data external: ', e.data);
				if (e.data.results) {
					// console.log('e.data.results: ', e.data.results);
					console.log('results received!');
				}

				console.timeEnd('start to finish worker');
			};

			console.time('start to finish worker');
			worker.postMessage({ selected, profile });
		};

		testFunction();
	}, [selected, profile]);

	// Extract values to display
	useEffect(() => {
		const { primary, inflationExpenses } = profile;

		console.log('results:', results);
		let retirementYrResult = results.find(
			(result) => result.primary.age === primary.retirementAge
		);
		// The person has already retired, use the currentage
		if (!retirementYrResult) {
			retirementYrResult = results.find((result) => result.primary.age === primary.currentAge);
		}

		const newSavingsAtRetirementFV = roundTo(retirementYrResult.value, -3);
		const newSavingsAtRetirementPV = roundTo(
			newSavingsAtRetirementFV /
				(1 + inflationExpenses) ** (primary.retirementAge - primary.currentAge),
			-3
		);

		const newIncomeAtRetirementFV = roundTo(retirementYrResult.incomeNeeded, -3);

		setSavingsAtRetirementPV(numeral(newSavingsAtRetirementPV).format('($0,0)'));
		setSavingsAtRetirementFV(numeral(newSavingsAtRetirementFV).format('($0,0)'));
		setIncomeAtRetirementFV(numeral(newIncomeAtRetirementFV).format('($0,0)'));
	}, [results, profile]);

	return (
		<section>
			{/* Top row of results */}
			<div className='dashboard-section'>
				<h2 className='client-name-title'>{clientName}</h2>

				<div className='retirement-results-top-row'>
					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>At Retirement</p>
						<p className='retirement-results-top-row-subtitle'>(Today Dollars)</p>
						<p className='retirement-results-top-row-value'>{savingsAtRetirementPV}</p>
					</div>

					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>At Retirement</p>
						<p className='retirement-results-top-row-subtitle'>(Future Dollars)</p>
						<p className='retirement-results-top-row-value'>{savingsAtRetirementFV}</p>
					</div>

					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>Retirement Income</p>
						<p className='retirement-results-top-row-subtitle'>(Future Dollars)</p>
						<p className='retirement-results-top-row-value'>{incomeAtRetirementFV}</p>
					</div>

					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>Lasts Until 95</p>
						<p className='retirement-results-top-row-value'>87%</p>
					</div>
				</div>
			</div>

			{/* Plan Results */}
			<div
				className='flex-row'
				// style={{ width: 'calc(100% - 1.75rem)' }}
			>
				{/* Plan Variation Toggles */}
				<div className='dashboard-section' style={{ marginRight: '2rem' }}>
					<RetirementVariations />
				</div>

				{/* Big boy graph */}
				<div className='dashboard-section' style={{ flexGrow: '1', overflow: 'hidden' }}>
					<RetirementChart results={results} />

					{/* Detailed results */}
					<div className='additional-details-section'>
						{/* Optional */}
						<p>Pension (60):</p>
						<p>$15,000</p>

						<p>Rental Income:</p>
						<p>$8,000</p>

						<p>Social Security (65):</p>
						<p>$20,000</p>

						<p>Average negative years:</p>
						<p>18</p>

						<p>Inflation (Income):</p>
						<p>{(profile.inflationIncome * 100).toFixed(1)}%</p>

						<p>Inflation (Expenses):</p>
						<p>{(profile.inflationExpenses * 100).toFixed(1)}%</p>

						<p>Inflation (Pension):</p>
						<p>2.5%</p>
					</div>
				</div>
				{/* Monte Carlo age probabilities */}
				{/* <div style={{ width: '1000px', height: '30px', border: '1px solid gray' }}></div> */}
			</div>
		</section>
	);
};

export default Retirement;

const roundTo = (numberToRound, precision) => {
	return Number(Math.round(numberToRound + `e${precision}`) + `e${-precision}`);
};

// FEATURE NUMBERS
// Savings at retirement
//   Nominal and present value
// Probability at a certain age
// distribution in retirement (starting)

// plug value to make the plan work

// BOTTOM DETAILS
// average # of negative years
// inflation (pension / income / expenses)
// future investments / withdrawals (future cashflows)
// pension / rental / etc amounts (alts) (corresponding ages)
// social security estimates (alts) (corresponding ages)

// BOTTOM PROBABILITIES BAR
// probabilities

// SIDE TOGGLE
// retirement age / income
// investment returns
//   both pre/post retirement?
// annual savings

// INPUT PAGE ONLY
// current ages
// plan ending ages
// liquid investments
// gross / net income
