import React, { useCallback, useContext, useState } from 'react';
import Collapse from 'react-css-collapse';
import { AppContext } from '../context/appContext';
import NumberInput from '../forms/NumberInput';

const Setup = () => {
	const { profile, setProfile, updateProfile } = useContext(AppContext);

	const [showRetirement, setShowRetirement] = useState(true);
	const [showRetirementAdvanced, setShowRetirementAdvanced] = useState(true);

	return (
		<>
			<section className='setup-section'>
				{/* RETIREMENT */}
				<h3 className='setup-section-title' onClick={() => setShowRetirement((prev) => !prev)}>
					Retirement Settings
				</h3>

				<Collapse isOpen={showRetirement}>
					<div className='setup-retirement-grid'>
						{/* Frequent Settings */}

						<p></p>
						<p>Primary</p>
						<p>Spouse</p>

						<label htmlFor='currentAge'>Current Age</label>
						<input
							className='number-input'
							type='number'
							id='currentAge'
							value={profile.primary.currentAge ?? ''}
							onChange={(value) => updateProfile(value, 'currentAge', 'primary')}
						/>
						<input
							className='number-input'
							type='number'
							id='currentAge'
							value={profile.spouse.currentAge ?? ''}
							onChange={(e) => updateProfile(Number(e.target.value), 'currentAge', 'spouse')}
						/>

						{/* Validation to do - ensure not less than current age */}
						<label htmlFor='retirementAge'>Retirement Age</label>
						<input
							className='number-input'
							type='number'
							id='retirementAge'
							value={profile.primary.retirementAge ?? ''}
							onChange={(e) =>
								updateProfile(Number(e.target.value), 'retirementAge', 'primary')
							}
						/>
						<input
							className='number-input'
							type='number'
							id='retirementAge'
							value={profile.spouse.retirementAge ?? ''}
							onChange={(e) =>
								updateProfile(Number(e.target.value), 'retirementAge', 'spouse')
							}
						/>

						<label htmlFor='annualSavings'>Annual Savings</label>
						<input
							className='number-input'
							type='number'
							id='annualSavings'
							value={profile.primary.annualSavings ?? ''}
							onChange={(e) =>
								updateProfile(Number(e.target.value), 'annualSavings', 'primary')
							}
						/>
						<input
							className='number-input'
							type='number'
							id='annualSavings'
							value={profile.spouse.annualSavings ?? ''}
							onChange={(e) =>
								updateProfile(Number(e.target.value), 'annualSavings', 'spouse')
							}
						/>

						<label htmlFor='startingInvestments'>Current Investments</label>
						<input
							className='number-input'
							type='number'
							id='startingInvestments'
							value={profile.startingInvestments ?? ''}
							onChange={(e) =>
								setProfile((prev) => ({
									...prev,
									startingInvestments: Number(e.target.value),
								}))
							}
						/>
						<p></p>

						<label htmlFor='retirementIncome'>Retirement Income</label>
						<input
							className='number-input'
							type='number'
							id='retirementIncome'
							value={profile.retirementIncome ?? ''}
							onChange={(e) => {
								setProfile((prev) => ({ ...prev, retirementIncome: Number(e.target.value) }));
							}}
						/>
						<p></p>

						{/* 
          // retirement age / income
          // current ages
          // annual savings
          // liquid investments
          // pension / rental / etc amounts (alts) (corresponding ages)
          */}
					</div>

					{/* Advanced Settings */}
					<div className='setup-retirement-additional-section'>
						<h3
							className='setup-retirement-additional-title'
							onClick={() => setShowRetirementAdvanced((prev) => !prev)}>
							Additional Options
						</h3>
						<Collapse isOpen={showRetirementAdvanced}>
							<label htmlFor='inflationIncome'>Inflation - Income</label>
							<input
								className='number-input'
								type='number'
								id='inflationIncome'
								value={profile.inflationIncome ?? ''}
								onChange={(e) =>
									setProfile((prev) => ({ ...prev, inflationIncome: Number(e.target.value) }))
								}
							/>
							<p></p>

							<label htmlFor='inflationExpenses'>Inflation - Expenses</label>
							<input
								className='number-input'
								type='number'
								id='inflationExpenses'
								value={profile.inflationExpenses ?? ''}
								onChange={(e) =>
									setProfile((prev) => ({
										...prev,
										inflationExpenses: Number(e.target.value),
									}))
								}
							/>
							<p></p>
						</Collapse>
					</div>
				</Collapse>
				<hr />
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
