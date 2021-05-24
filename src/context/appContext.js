import React, { createContext, useCallback, useState } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
	// STATE
	const [profile, setProfile] = useState({
		primary: {
			currentAge: 29,
			retirementAge: 65,
			annualSavings: 12000,
			currentIncome: 75000,
			pension: 30000,
		},
		spouse: {
			currentAge: 32,
			retirementAge: 62,
			annualSavings: 10000,
			currentIncome: 50000,
			pension: 0,
		},
		futureSavings: [
			{
				id: 1,
				value: 10000,
				yearStart: 5,
				numYears: 3,
				shouldInflate: false,
			},
		],
		futureIncomes: [
			{
				id: 1,
				value: 30000,
				yearStart: 30,
				numYears: 5,
				shouldInflate: false,
			},
		],
		startingInvestments: 150000,
		retirementIncome: 100000,
		inflationIncome: 0.02,
		inflationExpenses: 0.03,
		drawIncomeAfterBothRetired: false,
	});
	const [options, setOptions] = useState({
		preRetirementReturn: {
			one: 0.06,
			two: 0.07,
			three: 0.08,
		},
		postRetirementReturn: {
			one: 0.06,
			two: 0.07,
			three: 0.08,
		},
		retirementIncomeAdj: {
			one: 0.8,
			two: 1.0,
			three: 1.2,
		},
		retirementAgePrimary: {
			one: 60,
			two: 62,
			three: 65,
		},
		retirementAgeSpouse: {
			one: 60,
			two: 62,
			three: 65,
		},
		primarySavingsAdj: {
			one: 0.8,
			two: 1.0,
			three: 1.2,
		},
		spouseSavingsAdj: {
			one: 0.8,
			two: 1.0,
			three: 1.2,
		},
	});
	const [selected, setSelected] = useState({
		preRetirementReturn: 0.08,
		postRetirementReturn: 0.06,
		retirementIncome: 100000,
		primaryRetirementAge: 65,
		spouseRetirementAge: 62,
		primarySavings: 12000,
		spouseSavings: 10000,
	});

	const updateProfile = useCallback((value, property, parentProperty = null) => {
		setProfile((prev) => ({
			...prev,
			[parentProperty ?? property]: parentProperty
				? {
						...prev[parentProperty],
						[property]: value,
				  }
				: value,
		}));
	}, []);

	const updateOptions = useCallback((value, property, parentProperty = null) => {
		console.log('value, property, parentProperty:', value, property, parentProperty);
		setOptions((prev) => ({
			...prev,
			[parentProperty ?? property]: parentProperty
				? {
						...prev[parentProperty],
						[property]: value,
				  }
				: value,
		}));
	}, []);

	return (
		<AppContext.Provider
			value={{
				profile,
				setProfile,
				updateProfile,
				options,
				setOptions,
				updateOptions,
				selected,
				setSelected,
			}}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
