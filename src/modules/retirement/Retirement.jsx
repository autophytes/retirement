import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from './../../context/appContext';

import numeral from 'numeral';
import RetirementChart from './RetirementChart';
import RetirementVariations from './RetirementVariations';

const Retirement = ({ clientName }) => {
	const { profile, selected, options, updateProfile } = useContext(AppContext);

	const [savingsAtRetirementPV, setSavingsAtRetirementPV] = useState('$0');
	const [savingsAtRetirementFV, setSavingsAtRetirementFV] = useState('$0');
	const [incomeAtRetirementFV, setIncomeAtRetirementFV] = useState('$0');

	// Compute the updated projection results
	const results = useMemo(() => {
		const {
			primary,
			spouse,
			startingInvestments,
			inflationIncome,
			inflationExpenses,
			drawIncomeAfterBothRetired,
			futureSavings,
			futureIncomes,
		} = profile;
		const {
			retirementIncome,
			preRetirementReturn,
			postRetirementReturn,
			primaryRetirementAge,
			spouseRetirementAge,
			primarySavings,
			spouseSavings,
		} = selected;

		const endingAge = 100;

		let newResults = [
			{
				primary: {
					age: primary.currentAge,
					annualSavings: primarySavings,
					currentIncome: primary.currentIncome,
					pension: primary.pension,
				},
				spouse: {
					age: spouse.currentAge,
					annualSavings: spouseSavings,
					currentIncome: spouse.currentIncome,
					pension: spouse.pension,
				},
				value: startingInvestments,
				incomeNeeded: retirementIncome,
				futureSavings: futureSavings.filter(
					(item) => item.value && item.yearStart && item.numYears
				),
				futureIncomes: futureIncomes.filter(
					(item) => item.value && item.yearStart && item.numYears
				),
			},
		];

		const yearsToRun = endingAge - Math.min(primary.currentAge, spouse.currentAge);

		for (let year = 1; year <= yearsToRun; year++) {
			const prior = newResults[newResults.length - 1];

			let currentYear = {
				primary: {
					age: primary.currentAge + year,
					annualSavings: prior.primary.annualSavings * (1 + inflationIncome),
					currentIncome: prior.primary.currentIncome * (1 + inflationIncome),
					pension: prior.primary.pension * (1 + inflationIncome),
				},
				spouse: {
					age: spouse.currentAge + year,
					annualSavings: prior.spouse.annualSavings * (1 + inflationIncome),
					currentIncome: prior.spouse.currentIncome * (1 + inflationIncome),
					pension: prior.spouse.pension * (1 + inflationIncome),
				},
				incomeNeeded: prior.incomeNeeded * (1 + inflationExpenses),
				futureIncomes: prior.futureIncomes.map((item) => ({
					...item,
					value: item.shouldInflate ? item.value * (1 + inflationIncome) : item.value,
				})),
				futureSavings: prior.futureSavings.map((item) => ({
					...item,
					value: item.shouldInflate ? item.value * (1 + inflationIncome) : item.value,
				})),
			};

			const hasPrimaryRetired = primaryRetirementAge < currentYear.primary.age;
			const hasSpouseRetired = spouseRetirementAge < currentYear.spouse.age;
			const peopleRetired = (hasPrimaryRetired ? 1 : 0) + (hasSpouseRetired ? 1 : 0);

			// Add any additional savings
			const additionalIncome = futureIncomes.reduce((acc, item) => {
				if (year >= item.yearStart && year < item.yearStart + item.numYears) {
					return acc + item.value;
				}
				return acc;
			}, 0);
			console.log('additionalIncome:', additionalIncome);
			const incomeNeeded = prior.incomeNeeded - additionalIncome;

			if (peopleRetired === 0) {
				// NEITHER HAVE RETIRED
				currentYear.value =
					prior.value * (1 + preRetirementReturn) + // Grow the savings
					prior.primary.annualSavings + // Add the primary's contributions
					prior.spouse.annualSavings; // Add the spouse's contributions
			} else if (
				// ONE HAS RETIRED
				peopleRetired === 1
			) {
				// Pull the person object for the active worker
				const nonRetiredPerson = hasPrimaryRetired ? prior.spouse : prior.primary;
				const retiredPerson = hasPrimaryRetired ? prior.primary : prior.spouse;

				// Calculate whether the worker is making more or less than the income they needf
				const spouseIncomeDifference = nonRetiredPerson.currentIncome - incomeNeeded;

				// If they make more, calculate the contribution
				// If drawing income, then calculate if they can still contribute
				const contribution = drawIncomeAfterBothRetired
					? nonRetiredPerson.annualSavings
					: Math.min(Math.max(spouseIncomeDifference, 0), nonRetiredPerson.annualSavings);

				// If they make less, calculate the withdrawal
				const withdrawal = drawIncomeAfterBothRetired
					? 0
					: Math.min(spouseIncomeDifference + retiredPerson.pension, 0);

				currentYear.value =
					(prior.value + withdrawal) * (1 + preRetirementReturn) + contribution;
			} else {
				// TWO HAVE RETIRED
				currentYear.value =
					prior.value * (1 + postRetirementReturn) -
					Math.max(incomeNeeded - (prior.primary.pension + prior.spouse.pension), 0);
			}

			// Add any additional savings
			const additionalSavings = futureSavings.reduce((acc, item) => {
				if (year >= item.yearStart && year < item.yearStart + item.numYears) {
					return acc + item.value;
				}
				return acc;
			}, 0);
			currentYear.value += additionalSavings;

			// Store the result
			newResults.push(currentYear);
		}

		// console.table(newResults);
		return newResults;
	}, [profile, selected]);

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
			<div className='flex-row' style={{ gap: '2rem', width: 'calc(100% - 1.75rem)' }}>
				{/* Plan Variation Toggles */}
				<div className='dashboard-section'>
					<RetirementVariations />
				</div>

				{/* <div style={{ width: '2rem', flexShrink: '0' }}></div> */}

				{/* Big boy graph */}
				<div className='dashboard-section' style={{ width: '100%' }}>
					<div className='retirement-chart-container'>
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
