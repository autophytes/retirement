import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
	// STATE
	const [profile, setProfile] = useState({
		currentAge: 0,
		retirementAge: 0,
		annualSavings: 0,
		startingInvestments: 0,
		retirementIncome: 0,
		preRetirementReturn: 0,
		postRetirementReturn: 0,
		inflationIncome: 0.02,
		inflationExpenses: 0.03,
	});

	return (
		<AppContext.Provider
			value={{
				profile,
				setProfile,
			}}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
