import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from './../../context/appContext';

import numeral from 'numeral';
import RetirementChart from './RetirementChart';
import ProbabilityChart from './ProbabilityChart';
import RetirementVariations from './RetirementVariations';
import { generateResults } from './retirementFunctions';

import CalcWorker from '../../webWorkers/CalculateResults.worker';
import { roundTo } from '../../utils/utils';
import CountUpText from '../../utils/CountUpText';
const worker = new CalcWorker();

const Retirement = ({ clientName }) => {
	const { profile, selected, options, updateProfile, monteCarloCacheRef } =
		useContext(AppContext);

	const [savingsAtRetirementPV, setSavingsAtRetirementPV] = useState(0);
	const [savingsAtRetirementFV, setSavingsAtRetirementFV] = useState(0);
	const [incomeAtRetirementFV, setIncomeAtRetirementFV] = useState(0);
	const [bands, setBands] = useState([]);
	const [endingProb, setEndingProb] = useState('');
	const [negativeYears, setNegativeYears] = useState('');
	const [chartLeft, setChartLeft] = useState(0);

	// TODO - display survival probabilities
	// TODO - only render bands if the cacheKey matches what the results were calculated for?
	// Show an unlabled, narrow area chart. Track the mouse cursor / touch over the chart
	// Have a popup above the chart that shows 87: 95% that follows your finger,
	// adjusts the number as your finger moves
	// Round bands to the nearest thousand?
	// TODO - the future income / savings is slowing down the webworker a ton

	// Compute the updated projection results
	const results = useMemo(() => {
		const newResults = generateResults(profile, selected);
		return newResults.results;
	}, [profile, selected]);

	// Register monte carlo results handler
	useEffect(() => {
		// Register the worker handler function
		worker.onmessage = (e) => {
			// If we get data back from the worker
			if (e.data.results) {
				// Update the bands to render
				const newNegativeYears = numeral(e.data.avgNegativeYears).format('0.0');

				setBands(e.data.results);
				setNegativeYears(newNegativeYears);

				// Cache the results using the provided key
				if (e.data.cacheKey) {
					monteCarloCacheRef.current[e.data.cacheKey] = {};
					monteCarloCacheRef.current[e.data.cacheKey].results = e.data.results;
					monteCarloCacheRef.current[e.data.cacheKey].avgNegativeYears = newNegativeYears;
				}

				console.log('results received!');
			}

			console.timeEnd('start to finish worker');
		};
	}, []);

	// Pull probability at ending age
	useEffect(() => {
		// Temporarily hardcode "ending age"
		const endingAge = 95;
		const probArray = bands.map((item) => item[2]);

		// Don't set until we have our probabilities
		if (!probArray.length) return;

		const probIndex = endingAge - profile.primary.currentAge;

		const probabilty = probArray[probIndex] * 100; // 0 - 1
		// console.log('probabilty:', probabilty);

		// const formattedProbability = numeral(probabilty).format('0.0%');

		setEndingProb(probabilty);

		// TODO - eventually pull "ending age" from profile ob
		// TODO - need to stop the ending age blank flash
	}, [bands, profile]);

	// Calculate Monte Carlo
	useEffect(() => {
		// TODO - Try to figure out why the worker is so much slower in production (4sx slower)
		//   Tested, isn't browser version target. Maybe netlify?

		// Use config settings as cache key
		const cacheKey = JSON.stringify(selected) + JSON.stringify(profile);

		// Use cached results if available
		if (monteCarloCacheRef.current[cacheKey]) {
			setBands(monteCarloCacheRef.current[cacheKey].results);
			setNegativeYears(monteCarloCacheRef.current[cacheKey].avgNegativeYears);
		} else {
			// Reset the results
			setBands([]);
			setEndingProb('');
			setNegativeYears('');

			// Request calculation of new monte carlo results from web worker
			worker.postMessage({ selected, profile, cacheKey });
		}
	}, [selected, profile]);

	// Extract values to display
	useEffect(() => {
		const { primary, inflationExpenses } = profile;

		console.log('results:', results);
		let retirementYrResult = results.find(
			(result) => result.primary.age === selected.primaryRetirementAge
		);
		// The person has already retired, use the currentage
		if (!retirementYrResult) {
			retirementYrResult = results.find((result) => result.primary.age === primary.currentAge);
		}

		const newSavingsAtRetirementFV = roundTo(retirementYrResult.value / 1000, 0);
		// const newSavingsAtRetirementFV = roundTo(retirementYrResult.value, -3);

		const newSavingsAtRetirementPV = roundTo(
			retirementYrResult.value /
				(1 + inflationExpenses) ** (primary.retirementAge - primary.currentAge) /
				1000,
			0
		);
		// const newSavingsAtRetirementPV = roundTo(
		// 	newSavingsAtRetirementFV /
		// 		(1 + inflationExpenses) ** (primary.retirementAge - primary.currentAge),
		// 	-3
		// );

		const newIncomeAtRetirementFV = roundTo(retirementYrResult.incomeNeeded / 1000, 0);
		// const newIncomeAtRetirementFV = roundTo(retirementYrResult.incomeNeeded, -3);

		setSavingsAtRetirementPV(newSavingsAtRetirementPV);
		// setSavingsAtRetirementPV(numeral(newSavingsAtRetirementPV).format('($0,0)'));
		setSavingsAtRetirementFV(newSavingsAtRetirementFV);
		setIncomeAtRetirementFV(newIncomeAtRetirementFV);
	}, [results, profile, selected]);

	return (
		<section>
			{/* Top row of results */}
			<div className='dashboard-section'>
				<h2 className='client-name-title'>{clientName}</h2>

				<div className='retirement-results-top-row'>
					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>At Retirement</p>
						<p className='retirement-results-top-row-subtitle'>(Today Dollars)</p>
						<p className='retirement-results-top-row-value'>
							{/* {savingsAtRetirementPV} */}
							{/* <CountUpText /> */}
							<CountUpText value={savingsAtRetirementPV} />
						</p>
					</div>

					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>At Retirement</p>
						<p className='retirement-results-top-row-subtitle'>(Future Dollars)</p>
						<p className='retirement-results-top-row-value'>
							{/* {savingsAtRetirementFV} */}
							<CountUpText value={savingsAtRetirementFV} />
						</p>
					</div>

					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>Retirement Income</p>
						<p className='retirement-results-top-row-subtitle'>(Future Dollars)</p>
						<p className='retirement-results-top-row-value'>
							{/* {incomeAtRetirementFV} */}
							<CountUpText value={incomeAtRetirementFV} />
						</p>
					</div>

					<div className='retirement-results-top-row-section'>
						<p className='retirement-results-top-row-title'>Lasts Until 95</p>
						<p
							className='retirement-results-top-row-value'
							style={!endingProb ? { opacity: '0' } : {}}>
							<CountUpText value={endingProb} decimals={1} suffix='%' prefix='' />
						</p>
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
					<RetirementChart results={results} bands={bands} setChartLeft={setChartLeft} />
					<ProbabilityChart results={results} bands={bands} chartLeft={chartLeft} />
					{/*           
          Income - NEED
          Pension - NEED
          Starting Investments - NEED
          Future savings / incomes - NEED
          Inflations (income / expenses) - NEED
          Average negative years - NEED 
*/}

					{/* Detailed results */}
					<div className='additional-details-section-wrapper'>
						<div className='additional-details-section three-column'>
							<label />
							<label>Primary</label>
							<label>Spouse</label>

							<label>Pension</label>
							<p>20,000</p>
							<p>30,000</p>

							<label>Income</label>
							<p>20,000</p>
							<p>30,000</p>
							{/* PENSION */}
							{/* Income */}
						</div>

						<div className='additional-details-section two-column'>
							{/* Optional */}
							<p>Pension (60):</p>
							<p>$15,000</p>

							<p>Rental Income:</p>
							<p>$8,000</p>
						</div>
						<div className='additional-details-section two-column'>
							<p>Social Security (65):</p>
							<p>$20,000</p>

							<p>Average negative years:</p>
							<p>{negativeYears}</p>
						</div>
						<div className='additional-details-section two-column'>
							<p>Inflation (Income):</p>
							<p>{(profile.inflationIncome * 100).toFixed(1)}%</p>

							<p>Inflation (Expenses):</p>
							<p>{(profile.inflationExpenses * 100).toFixed(1)}%</p>

							<p>Inflation (Pension):</p>
							<p>2.5%</p>
						</div>
					</div>
				</div>
				{/* Monte Carlo age probabilities */}
				{/* <div style={{ width: '1000px', height: '30px', border: '1px solid gray' }}></div> */}
			</div>
		</section>
	);
};

export default Retirement;

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
