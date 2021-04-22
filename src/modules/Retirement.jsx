import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../context/appContext';

import numeral from 'numeral';

const Retirement = () => {
	const { profile, setProfile } = useContext(AppContext);

	const [savingsAtRetirementPV, setSavingsAtRetirementPV] = useState(0);
	const [savingsAtRetirementFV, setSavingsAtRetirementFV] = useState(0);
	const [incomeAtRetirementFV, setIncomeAtRetirementFV] = useState(0);

	const results = useMemo(() => {
		const {
			currentAge,
			retirementAge,
			annualSavings,
			startingInvestments,
			retirementIncome,
			inflationIncome,
			inflationExpenses,
			preRetirementReturn,
			postRetirementReturn,
		} = profile;
		const endingAge = 100;

		let newResults = [
			{
				age: currentAge,
				value: startingInvestments,
				incomeNeeded: retirementIncome,
				annualSavings: annualSavings,
			},
		];

		for (let age = currentAge + 1; age <= endingAge; age++) {
			const prior = newResults[newResults.length - 1];

			let currentYear = {
				age: age,
				incomeNeeded: prior.incomeNeeded * (1 + inflationExpenses),
				annualSavings: prior.annualSavings * (1 + inflationIncome),
			};

			if (age <= retirementAge) {
				currentYear.value = prior.value * (1 + preRetirementReturn) + prior.annualSavings;
			} else {
				currentYear.value = prior.value * (1 + postRetirementReturn) - prior.incomeNeeded;
			}

			newResults.push(currentYear);
		}

		return newResults;
	}, [profile]);

	useEffect(() => {
		const { retirementAge, inflationExpenses, currentAge } = profile;

		const retirementYrResult = results.find((result) => result.age === 65);

		const newSavingsAtRetirementFV = roundTo(retirementYrResult.value, -3);
		const newSavingsAtRetirementPV = roundTo(
			newSavingsAtRetirementFV / (1 + inflationExpenses) ** (retirementAge - currentAge),
			-3
		);

		const newIncomeAtRetirementFV = roundTo(retirementYrResult.incomeNeeded, -3);

		setSavingsAtRetirementPV(numeral(newSavingsAtRetirementPV).format('($0,0)'));
		setSavingsAtRetirementFV(numeral(newSavingsAtRetirementFV).format('($0,0)'));
		setIncomeAtRetirementFV(numeral(newIncomeAtRetirementFV).format('($0,0)'));
	}, [results, profile]);

	console.table(results);

	return (
		<section className='flex-row'>
			{/* Plan Variation Toggles */}
			<div>
				<h3>Pre-Retirement Return</h3>
				<div className='variation-section'>
					<button
						className={
							'variation-section-button' +
							(profile.preRetirementReturn === 0.06 ? ' active' : '')
						}
						onClick={(e) => setProfile((prev) => ({ ...prev, preRetirementReturn: 0.06 }))}>
						{(0.06 * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.preRetirementReturn === 0.07 ? ' active' : '')
						}
						onClick={(e) => setProfile((prev) => ({ ...prev, preRetirementReturn: 0.07 }))}>
						{(0.07 * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.preRetirementReturn === 0.08 ? ' active' : '')
						}
						onClick={(e) => setProfile((prev) => ({ ...prev, preRetirementReturn: 0.08 }))}>
						{(0.08 * 100).toFixed(1)}%
					</button>
				</div>

				<h3>Post-Retirement Return</h3>
				<div className='variation-section'>
					<button
						className={
							'variation-section-button' +
							(profile.postRetirementReturn === 0.06 ? ' active' : '')
						}
						onClick={(e) => setProfile((prev) => ({ ...prev, postRetirementReturn: 0.06 }))}>
						{(0.06 * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.postRetirementReturn === 0.07 ? ' active' : '')
						}
						onClick={(e) => setProfile((prev) => ({ ...prev, postRetirementReturn: 0.07 }))}>
						{(0.07 * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.postRetirementReturn === 0.08 ? ' active' : '')
						}
						onClick={(e) => setProfile((prev) => ({ ...prev, postRetirementReturn: 0.08 }))}>
						{(0.08 * 100).toFixed(1)}%
					</button>
				</div>

				<h3>Income</h3>
				<div>
					<button className='variation-section-button'>70,000</button>
					<button className='variation-section-button'>80,000</button>
					<button className='variation-section-button'>90,000</button>
				</div>

				<h3>Retirement Age</h3>
				<div>
					<button className='variation-section-button'>55</button>
					<button className='variation-section-button'>60</button>
					<button className='variation-section-button'>65</button>
				</div>

				<h3>Savings</h3>
				<div>
					<button className='variation-section-button'>$5,000</button>
					<button className='variation-section-button'>$10,000</button>
					<button className='variation-section-button'>$15,000</button>
				</div>
			</div>

			{/* Plan Results */}
			<div>
				{/* Top row of results */}
				<div className='top-row'>
					<div className='top-row-section'>
						<p>At Retirement (Today Dollars)</p>
						<p>{savingsAtRetirementPV}</p>
					</div>

					<div className='top-row-section'>
						<p>At Retirement (Future Dollars)</p>
						<p>{savingsAtRetirementFV}</p>
					</div>

					<div className='top-row-section'>
						<p>Lasts Until 95</p>
						<p>87%</p>
					</div>

					<div className='top-row-section'>
						<p>Retirement Income (Future Dollars)</p>
						<p>{incomeAtRetirementFV}</p>
					</div>
				</div>

				{/* Big boy graph */}
				<div style={{ width: '1000px', height: '500px', border: '1px solid gray' }}></div>

				{/* Monte Carlo age probabilities */}
				<div style={{ width: '1000px', height: '30px', border: '1px solid gray' }}></div>

				{/* Detailed results */}
				<div>
					{/* Optional */}
					<p>Pension (60): $15,000</p>
					<p>Rental Income: $8,000</p>
					<p>Social Security (65): $20,000</p>

					<p>Average negative years: 18</p>
					<p>Inflation (Income): {(profile.inflationIncome * 100).toFixed(1)}%</p>
					<p>Inflation (Expenses): {(profile.inflationExpenses * 100).toFixed(1)}%</p>
					<p>Inflation (Pension): 2.5%</p>
				</div>
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
