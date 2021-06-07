import gaussian from 'gaussian';

// const endingAge = 100;
// console.log('preRetirementReturn:', preRetirementReturn);

// const distribution = gaussian(preRetirementReturn, 0.12 ** 2);
// for (let i = 0; i < 10; i++) {
//   console.log('distribution:', distribution.ppf(Math.random()));
// }

export const generateResults = (
	profile,
	selected,
	isSimulatedResults = false,
	preDistributionObjDefault = null,
	postDistributionObjDefault = null
) => {
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
			spouse: spouse.isNoSpouse
				? {
						age: 0,
						annualSavings: 0,
						currentIncome: 0,
						pension: 0,
				  }
				: {
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

	const yearsToRun =
		endingAge -
		(spouse.isNoSpouse ? primary.currentAge : Math.min(primary.currentAge, spouse.currentAge));

	const preDistributionObj =
		preDistributionObjDefault ?? gaussian(preRetirementReturn, 0.15 ** 2);
	const postDistributionObj =
		postDistributionObjDefault ?? gaussian(postRetirementReturn, 0.15 ** 2);

	let returnsArray = [];

	// Calculate investment returns, adjust to reflect mean
	if (isSimulatedResults) {
		let preReturnsArray = [];
		let postReturnsArray = [];

		for (let year = 1; year <= yearsToRun; year++) {
			const hasPrimaryRetired = primaryRetirementAge < primary.currentAge + year;
			const hasSpouseRetired = spouse.isNoSpouse
				? hasPrimaryRetired // If no spouse, mimic what primary is doing
				: spouseRetirementAge < spouse.currentAge + year;

			const peopleRetired = (hasPrimaryRetired ? 1 : 0) + (hasSpouseRetired ? 1 : 0);

			// Determine the year's investment return
			if (peopleRetired > 1) {
				postReturnsArray.push(postDistributionObj.ppf(Math.random()));
			} else {
				preReturnsArray.push(preDistributionObj.ppf(Math.random()));
			}
		}

		const preReturnTotal = preReturnsArray.reduce((sum, value) => (1 + value) * sum, 1);
		const preReturnIRR = preReturnTotal ** (1 / preReturnsArray.length) - 1;
		const preAdjustment = preRetirementReturn - preReturnIRR;
		preReturnsArray = preReturnsArray.map((item) => item + preAdjustment);

		const postReturnTotal = postReturnsArray.reduce((sum, value) => (1 + value) * sum, 1);
		const postReturnIRR = postReturnTotal ** (1 / postReturnsArray.length) - 1;
		const postAdjustment = postRetirementReturn - postReturnIRR;
		postReturnsArray = postReturnsArray.map((item) => item + postAdjustment);

		returnsArray = [...preReturnsArray, ...postReturnsArray];
	}

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
		const hasSpouseRetired = spouse.isNoSpouse
			? hasPrimaryRetired // If no spouse, mimic what primary is doing
			: spouseRetirementAge < currentYear.spouse.age;

		const peopleRetired = (hasPrimaryRetired ? 1 : 0) + (hasSpouseRetired ? 1 : 0);

		// Determine the year's investment return
		let investmentReturn = peopleRetired > 1 ? postRetirementReturn : preRetirementReturn;
		if (isSimulatedResults) {
			// const distribution = peopleRetired > 1 ? postDistributionObj : preDistributionObj;
			// const distribution = gaussian(investmentReturn, 0.12 ** 2); // EVENTUALLY PULL STDEV
			// investmentReturn = distribution.ppf(Math.random());

			investmentReturn = returnsArray[year - 1];
		}

		// Add any additional savings
		const additionalIncome = futureIncomes.reduce((acc, item) => {
			if (year >= item.yearStart && year < item.yearStart + item.numYears) {
				return acc + item.value;
			}
			return acc;
		}, 0);
		const incomeNeeded = prior.incomeNeeded - additionalIncome;

		if (peopleRetired === 0) {
			// NEITHER HAVE RETIRED
			currentYear.value =
				prior.value * (1 + investmentReturn) + // Grow the savings
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

			currentYear.value = (prior.value + withdrawal) * (1 + investmentReturn) + contribution;
		} else {
			// TWO HAVE RETIRED
			currentYear.value =
				prior.value * (1 + investmentReturn) -
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
	return {
		results: isSimulatedResults ? newResults.map((item) => item.value) : newResults,
		returns: returnsArray,
	};
	// return newResults;
};
