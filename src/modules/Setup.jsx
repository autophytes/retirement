import React, { useContext, useState } from 'react';
import { AppContext } from '../context/appContext';

const Setup = () => {
	const { profile, setProfile } = useContext(AppContext);

	return (
		<>
			<section className='flex-row'>
				<label htmlFor='currentAge'>Current Age</label>
				<input
					type='number'
					id='currentAge'
					value={profile.currentAge ?? ''}
					onChange={(e) =>
						setProfile((prev) => ({ ...prev, currentAge: Number(e.target.value) }))
					}
				/>
				<label htmlFor='retirementAge'>Retirement Age</label>
				<input
					type='number'
					id='retirementAge'
					value={profile.retirementAge ?? ''}
					onChange={(e) =>
						setProfile((prev) => ({ ...prev, retirementAge: Number(e.target.value) }))
					}
				/>
				<label htmlFor='annualSavings'>Annual Savings</label>
				<input
					type='number'
					id='annualSavings'
					value={profile.annualSavings ?? ''}
					onChange={(e) =>
						setProfile((prev) => ({ ...prev, annualSavings: Number(e.target.value) }))
					}
				/>
				<label htmlFor='startingInvestments'>Current Investments</label>
				<input
					type='number'
					id='startingInvestments'
					value={profile.startingInvestments ?? ''}
					onChange={(e) =>
						setProfile((prev) => ({ ...prev, startingInvestments: Number(e.target.value) }))
					}
				/>
				<label htmlFor='retirementIncome'>Retirement Income</label>
				<input
					type='number'
					id='retirementIncome'
					value={profile.retirementIncome ?? ''}
					onChange={(e) => {
						setProfile((prev) => ({ ...prev, retirementIncome: Number(e.target.value) }));
					}}
				/>
			</section>

			<section className='flex-row'>
				<label htmlFor='inflationIncome'>Inflation - Income</label>
				<input
					type='number'
					id='inflationIncome'
					value={profile.inflationIncome ?? ''}
					onChange={(e) =>
						setProfile((prev) => ({ ...prev, inflationIncome: Number(e.target.value) }))
					}
				/>

				<label htmlFor='inflationExpenses'>Inflation - Expenses</label>
				<input
					type='number'
					id='inflationExpenses'
					value={profile.inflationExpenses ?? ''}
					onChange={(e) =>
						setProfile((prev) => ({ ...prev, inflationExpenses: Number(e.target.value) }))
					}
				/>
			</section>
		</>
	);
};

export default Setup;

// Inputs

// Changed Every Time
// retirement age / income
// current ages
// annual savings
// gross / net income
// liquid investments
// pension / rental / etc amounts (alts) (corresponding ages)
// future investments / withdrawals (future cashflows)

// Have defaults but can change
// social security estimates (alts) (corresponding ages)
// investment returns
//   both pre/post retirement?
// volatility
// Target ending age (maybe...)
// inflation (pension / income / expenses)
