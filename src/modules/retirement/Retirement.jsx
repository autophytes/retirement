import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from './../../context/appContext';

import numeral from 'numeral';
import RetirementChart from './RetirementChart';
import RetirementVariations from './RetirementVariations';
import { generateResults } from './retirementFunctions';

import CalcWorker from '../../webWorkers/CalculateResults.worker';
const worker = new CalcWorker();

const Retirement = ({ clientName }) => {
	const { profile, selected, options, updateProfile, monteCarloCacheRef } =
		useContext(AppContext);

	const [savingsAtRetirementPV, setSavingsAtRetirementPV] = useState('$0');
	const [savingsAtRetirementFV, setSavingsAtRetirementFV] = useState('$0');
	const [incomeAtRetirementFV, setIncomeAtRetirementFV] = useState('$0');
	const [bands, setBands] = useState([]);

	// TODO - display survival probabilities
	// TODO - only render bands if the cacheKey matches what the results were calculated for?

	// Compute the updated projection results
	const results = useMemo(() => generateResults(profile, selected), [profile, selected]);

	// Register monte carlo results handler
	useEffect(() => {
		// Register the worker handler function
		worker.onmessage = (e) => {
			// If we get data back from the worker
			if (e.data.results) {
				// Update the bands to render
				setBands(e.data.results);

				// Cache the results using the provided key
				if (e.data.cacheKey) {
					monteCarloCacheRef.current[e.data.cacheKey] = e.data.results;
				}

				console.log('results received!');
			}

			console.timeEnd('start to finish worker');
		};
	}, []);

	// Calculate Monte Carlo
	useEffect(() => {
		// TODO - Try to figure out why the worker is so much slower in production (4sx slower)
		//   Tested, isn't browser version target. Maybe netlify?

		// Use config settings as cache key
		const cacheKey = JSON.stringify(selected) + JSON.stringify(profile);

		// Use cached results if available
		if (monteCarloCacheRef.current[cacheKey]) {
			setBands(monteCarloCacheRef.current[cacheKey]);
		} else {
			// Reset the results
			setBands([]);

			// Request calculation of new monte carlo results from web worker
			worker.postMessage({ selected, profile, cacheKey });
		}
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
					<RetirementChart results={results} bands={bands} />

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
