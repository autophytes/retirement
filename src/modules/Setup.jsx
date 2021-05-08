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
					<div className='flex-row'>
						<div className='setup-retirement-grid' style={{ marginRight: '2rem' }}>
							{/* Frequent Settings */}

							<p></p>
							<label id='primaryColumn' style={{ textAlign: 'center' }}>
								Primary
							</label>
							<label id='spouseColumn' style={{ textAlign: 'center' }}>
								Spouse
							</label>

							<label htmlFor='currentAge' id='currentAgeLabel'>
								Current Age
							</label>
							<input
								className='number-input'
								type='number'
								id='currentAge'
								aria-labelledby='primaryColumn currentAgeLabel'
								value={profile.primary.currentAge ?? ''}
								onChange={(e) =>
									updateProfile(Number(e.target.value), 'currentAge', 'primary')
								}
							/>
							<input
								className='number-input'
								type='number'
								aria-labelledby='spouseColumn currentAgeLabel'
								value={profile.spouse.currentAge ?? ''}
								onChange={(e) => updateProfile(Number(e.target.value), 'currentAge', 'spouse')}
							/>

							{/* Validation to do - ensure not less than current age */}
							<label htmlFor='retirementAge' id='retirementAgeLabel'>
								Retirement Age
							</label>
							<input
								className='number-input'
								type='number'
								id='retirementAge'
								aria-labelledby='primaryColumn retirementAgeLabel'
								value={profile.primary.retirementAge ?? ''}
								onChange={(e) =>
									updateProfile(Number(e.target.value), 'retirementAge', 'primary')
								}
							/>
							<input
								className='number-input'
								type='number'
								aria-labelledby='spouseColumn retirementAgeLabel'
								value={profile.spouse.retirementAge ?? ''}
								onChange={(e) =>
									updateProfile(Number(e.target.value), 'retirementAge', 'spouse')
								}
							/>

							<label htmlFor='currentIncome' id='currentIncomeLabel'>
								Current Income
							</label>
							<input
								className='number-input'
								type='number'
								id='currentIncome'
								aria-labelledby='primaryColumn currentIncomeLabel'
								value={profile.primary.currentIncome ?? ''}
								onChange={(e) =>
									updateProfile(Number(e.target.value), 'currentIncome', 'primary')
								}
							/>
							<input
								className='number-input'
								type='number'
								aria-labelledby='spouseColumn currentIncomeLabel'
								value={profile.spouse.currentIncome ?? ''}
								onChange={(e) =>
									updateProfile(Number(e.target.value), 'currentIncome', 'spouse')
								}
							/>

							<label htmlFor='annualSavings' id='annualSavingsLabel'>
								Annual Savings
							</label>
							<input
								className='number-input'
								type='number'
								id='annualSavings'
								aria-labelledby='primaryColumn annualSavingsLabel'
								value={profile.primary.annualSavings ?? ''}
								onChange={(e) =>
									updateProfile(Number(e.target.value), 'annualSavings', 'primary')
								}
							/>
							<input
								className='number-input'
								type='number'
								aria-labelledby='spouseColumn annualSavingsLabel'
								value={profile.spouse.annualSavings ?? ''}
								onChange={(e) =>
									updateProfile(Number(e.target.value), 'annualSavings', 'spouse')
								}
							/>

							{/* 
          // retirement age / income
          // current ages
          // annual savings
          // liquid investments
          // pension / rental / etc amounts (alts) (corresponding ages)
          // future cash
          */}
						</div>

						<div className='setup-retirement-grid'>
							<p></p>
							<label>&nbsp;</label> {/* Use the label to match the row height */}
							<p></p>
							<label htmlFor='startingInvestments' id='startingInvestmentsLabel'>
								Current Investments
							</label>
							<NumberInput
								className='number-input'
								id='startingInvestments'
								// decimalPlaces={1}
								isCurrency
								// isPercent
								aria-labelledby='startingInvestmentsLabel'
								value={profile.startingInvestments ?? ''}
								onChange={(value) =>
									setProfile((prev) => ({
										...prev,
										startingInvestments: value,
									}))
								}
							/>
							<p></p>
							<label htmlFor='retirementIncome' id='retirementIncomeLabel'>
								Retirement Income
							</label>
							<input
								className='number-input'
								type='number'
								id='retirementIncome'
								aria-labelledby='retirementIncomeLabel'
								value={profile.retirementIncome ?? ''}
								onChange={(e) => {
									setProfile((prev) => ({
										...prev,
										retirementIncome: Number(e.target.value),
									}));
								}}
							/>
							<p></p>
						</div>
					</div>

					{/* Advanced Settings */}
					<div className='setup-retirement-additional-section'>
						<h3
							className='setup-retirement-additional-title'
							onClick={() => setShowRetirementAdvanced((prev) => !prev)}>
							Additional Options
						</h3>
						<Collapse isOpen={showRetirementAdvanced}>
							<div className='setup-retirement-grid'>
								<label htmlFor='inflationIncome'>Inflation - Income</label>
								<input
									className='number-input'
									type='number'
									id='inflationIncome'
									value={profile.inflationIncome ?? ''}
									onChange={(e) =>
										setProfile((prev) => ({
											...prev,
											inflationIncome: Number(e.target.value),
										}))
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
							</div>
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
