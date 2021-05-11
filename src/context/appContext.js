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
		},
		spouse: {
			currentAge: 32,
			retirementAge: 62,
			annualSavings: 10000,
			currentIncome: 50000,
		},
		startingInvestments: 150000,
		retirementIncome: 100000,
		preRetirementReturn: 0.08,
		postRetirementReturn: 0.06,
		inflationIncome: 0.02,
		inflationExpenses: 0.03,
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
			}}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
