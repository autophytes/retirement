import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
	// STATE
	const [profile, setProfile] = useState({
		currentAge: 29,
		retirementAge: 65,
		annualSavings: 10000,
		startingInvestments: 50000,
		retirementIncome: 60000,
		preRetirementReturn: 0.08,
		postRetirementReturn: 0.06,
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
