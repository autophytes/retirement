import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from './../../context/appContext';

import numeral from 'numeral';
import RetirementChart from './RetirementChart';

const Retirement = () => {
	const { profile, setProfile, updateProfile } = useContext(AppContext);

	const [savingsAtRetirementPV, setSavingsAtRetirementPV] = useState('$0');
	const [savingsAtRetirementFV, setSavingsAtRetirementFV] = useState('$0');
	const [incomeAtRetirementFV, setIncomeAtRetirementFV] = useState('$0');

	// Compute the updated projection results
	const results = useMemo(() => {
		const {
			primary,
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
				age: primary.currentAge,
				value: startingInvestments,
				incomeNeeded: retirementIncome,
				primaryAnnualSavings: primary.annualSavings,
			},
		];

		for (let age = primary.currentAge + 1; age <= endingAge; age++) {
			const prior = newResults[newResults.length - 1];

			let currentYear = {
				age: age,
				incomeNeeded: prior.incomeNeeded * (1 + inflationExpenses),
				primaryAnnualSavings: prior.primaryAnnualSavings * (1 + inflationIncome),
			};

			if (age <= primary.retirementAge) {
				currentYear.value =
					prior.value * (1 + preRetirementReturn) + prior.primaryAnnualSavings;
			} else {
				currentYear.value = prior.value * (1 + postRetirementReturn) - prior.incomeNeeded;
			}

			newResults.push(currentYear);
		}

		// console.table(newResults);
		return newResults;
	}, [profile]);

	// Extract values to display
	useEffect(() => {
		const { primary, inflationExpenses } = profile;

		let retirementYrResult = results.find((result) => result.age === primary.retirementAge);
		// The person has already retired, use the currentage
		if (!retirementYrResult) {
			retirementYrResult = results.find((result) => result.age === primary.currentAge);
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
		<section className='flex-row'>
			{/* Plan Variation Toggles */}
			<div>
				<div className='variation-section'>
					<h3>Pre-Retirement Return</h3>
					<div className='variation-section-buttons'>
						<button
							className={
								'variation-section-button' +
								(profile.preRetirementReturn === 0.06 ? ' active' : '')
							}
							onClick={() => updateProfile(0.06, 'preRetirementReturn')}>
							{(0.06 * 100).toFixed(1)}%
						</button>

						<button
							className={
								'variation-section-button' +
								(profile.preRetirementReturn === 0.07 ? ' active' : '')
							}
							onClick={() => updateProfile(0.07, 'preRetirementReturn')}>
							{(0.07 * 100).toFixed(1)}%
						</button>

						<button
							className={
								'variation-section-button' +
								(profile.preRetirementReturn === 0.08 ? ' active' : '')
							}
							onClick={() => updateProfile(0.08, 'preRetirementReturn')}>
							{(0.08 * 100).toFixed(1)}%
						</button>
					</div>
				</div>

				<div className='variation-section'>
					<h3>Post-Retirement Return</h3>
					<div className='variation-section-buttons'>
						<button
							className={
								'variation-section-button' +
								(profile.postRetirementReturn === 0.06 ? ' active' : '')
							}
							onClick={() => updateProfile(0.06, 'postRetirementReturn')}>
							{(0.06 * 100).toFixed(1)}%
						</button>

						<button
							className={
								'variation-section-button' +
								(profile.postRetirementReturn === 0.07 ? ' active' : '')
							}
							onClick={() => updateProfile(0.07, 'postRetirementReturn')}>
							{(0.07 * 100).toFixed(1)}%
						</button>

						<button
							className={
								'variation-section-button' +
								(profile.postRetirementReturn === 0.08 ? ' active' : '')
							}
							onClick={() => updateProfile(0.08, 'postRetirementReturn')}>
							{(0.08 * 100).toFixed(1)}%
						</button>
					</div>
				</div>

				<div className='variation-section'>
					<h3>Income</h3>
					<div className='variation-section-buttons'>
						<button
							className={
								'variation-section-button' +
								(profile.retirementIncome === 70000 ? ' active' : '')
							}
							onClick={() => updateProfile(70000, 'retirementIncome')}>
							70,000
						</button>
						<button
							className={
								'variation-section-button' +
								(profile.retirementIncome === 80000 ? ' active' : '')
							}
							onClick={() => updateProfile(80000, 'retirementIncome')}>
							80,000
						</button>
						<button
							className={
								'variation-section-button' +
								(profile.retirementIncome === 90000 ? ' active' : '')
							}
							onClick={() => updateProfile(90000, 'retirementIncome')}>
							90,000
						</button>
					</div>
				</div>

				<div className='variation-section'>
					<h3>Retirement Age</h3>
					<div className='variation-section-buttons'>
						<button
							className={
								'variation-section-button' +
								(profile.primary.retirementAge === 55 ? ' active' : '')
							}
							onClick={() => updateProfile(55, 'retirementAge', 'primary')}>
							55
						</button>
						<button
							className={
								'variation-section-button' +
								(profile.primary.retirementAge === 60 ? ' active' : '')
							}
							onClick={() => updateProfile(60, 'retirementAge', 'primary')}>
							60
						</button>
						<button
							className={
								'variation-section-button' +
								(profile.primary.retirementAge === 65 ? ' active' : '')
							}
							onClick={() => updateProfile(65, 'retirementAge', 'primary')}>
							65
						</button>
					</div>
				</div>

				<div className='variation-section'>
					<h3>Savings</h3>
					<div className='variation-section-buttons'>
						<button
							className={
								'variation-section-button' +
								(profile.primary.annualSavings === 5000 ? ' active' : '')
							}
							onClick={() => updateProfile(5000, 'annualSavings', 'primary')}>
							$5,000
						</button>
						<button
							className={
								'variation-section-button' +
								(profile.primary.annualSavings === 10000 ? ' active' : '')
							}
							onClick={() => updateProfile(10000, 'annualSavings', 'primary')}>
							$10,000
						</button>
						<button
							className={
								'variation-section-button' +
								(profile.primary.annualSavings === 15000 ? ' active' : '')
							}
							onClick={() => updateProfile(15000, 'annualSavings', 'primary')}>
							$15,000
						</button>
					</div>
				</div>
			</div>

			{/* Plan Results */}
			<div>
				{/* Top row of results */}
				<div className='top-row'>
					<div className='top-row-section'>
						<p className='top-row-title'>At Retirement</p>
						<p className='top-row-subtitle'>(Today Dollars)</p>
						<p className='top-row-value'>{savingsAtRetirementPV}</p>
					</div>

					<div className='top-row-section'>
						<p className='top-row-title'>At Retirement</p>
						<p className='top-row-subtitle'>(Future Dollars)</p>
						<p className='top-row-value'>{savingsAtRetirementFV}</p>
					</div>

					<div className='top-row-section'>
						<p className='top-row-title'>Retirement Income</p>
						<p className='top-row-subtitle'>(Future Dollars)</p>
						<p className='top-row-value'>{incomeAtRetirementFV}</p>
					</div>

					<div className='top-row-section'>
						<p className='top-row-title'>Lasts Until 95</p>
						<p className='top-row-value'>87%</p>
					</div>
				</div>

				{/* Big boy graph */}
				<div style={{ width: '1000px', height: '500px', border: '1px solid gray' }}>
					<RetirementChart results={results} />
				</div>

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
