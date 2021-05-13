import React, { useContext, useState } from 'react';
import Collapse from 'react-css-collapse';
import { AppContext } from '../context/appContext';
import NumberInput from '../forms/NumberInput';

const Setup = () => {
	const { profile, setProfile, updateProfile, options, updateOptions, setSelected } =
		useContext(AppContext);

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
							<NumberInput
								id='currentAge'
								decimalPlaces={0}
								max={120}
								aria-labelledby='primaryColumn currentAgeLabel'
								value={profile.primary.currentAge ?? ''}
								onChange={(value) => updateProfile(value, 'currentAge', 'primary')}
							/>
							<NumberInput
								decimalPlaces={0}
								max={120}
								aria-labelledby='spouseColumn currentAgeLabel'
								value={profile.spouse.currentAge ?? ''}
								onChange={(value) => updateProfile(value, 'currentAge', 'spouse')}
							/>

							{/* Validation to do - ensure not less than current age */}
							<label htmlFor='retirementAge' id='retirementAgeLabel'>
								Retirement Age
							</label>
							<NumberInput
								id='retirementAge'
								decimalPlaces={0}
								max={120}
								aria-labelledby='primaryColumn retirementAgeLabel'
								value={profile.primary.retirementAge ?? ''}
								onChange={(value) => {
									setSelected((prev) => ({ ...prev, primaryRetirementAge: value }));
									updateProfile(value, 'retirementAge', 'primary');
								}}
							/>
							<NumberInput
								decimalPlaces={0}
								max={120}
								aria-labelledby='spouseColumn retirementAgeLabel'
								value={profile.spouse.retirementAge ?? ''}
								onChange={(value) => {
									setSelected((prev) => ({ ...prev, spouseRetirementAge: value }));
									updateProfile(value, 'retirementAge', 'spouse');
								}}
							/>

							<label htmlFor='currentIncome' id='currentIncomeLabel'>
								Current Income
							</label>
							<NumberInput
								id='currentIncome'
								decimalPlaces={0}
								isCurrency
								aria-labelledby='primaryColumn currentIncomeLabel'
								value={profile.primary.currentIncome ?? ''}
								onChange={(value) => updateProfile(value, 'currentIncome', 'primary')}
							/>
							<NumberInput
								decimalPlaces={0}
								isCurrency
								aria-labelledby='spouseColumn currentIncomeLabel'
								value={profile.spouse.currentIncome ?? ''}
								onChange={(value) => updateProfile(value, 'currentIncome', 'spouse')}
							/>

							<label htmlFor='annualSavings' id='annualSavingsLabel'>
								Annual Savings
							</label>
							<NumberInput
								decimalPlaces={0}
								isCurrency
								id='annualSavings'
								aria-labelledby='primaryColumn annualSavingsLabel'
								value={profile.primary.annualSavings ?? ''}
								onChange={(value) => updateProfile(value, 'annualSavings', 'primary')}
							/>
							<NumberInput
								decimalPlaces={0}
								isCurrency
								aria-labelledby='spouseColumn annualSavingsLabel'
								value={profile.spouse.annualSavings ?? ''}
								onChange={(value) => updateProfile(value, 'annualSavings', 'spouse')}
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
							{/* EMTPY ROW */}
							<p></p>
							<label>&nbsp;</label> {/* Use the label to match the row height */}
							<p></p>
							{/* CURRENT INVESTMENTS */}
							<label htmlFor='startingInvestments' id='startingInvestmentsLabel'>
								Current Investments
							</label>
							<NumberInput
								id='startingInvestments'
								decimalPlaces={0}
								isCurrency
								aria-labelledby='startingInvestmentsLabel'
								value={profile.startingInvestments ?? ''}
								onChange={(value) =>
									setProfile((prev) => ({
										...prev,
										startingInvestments: value,
									}))
								}
							/>
							<br />
							{/* RETIREMENT INCOME */}
							<label htmlFor='retirementIncome' id='retirementIncomeLabel'>
								Retirement Income
							</label>
							<NumberInput
								id='retirementIncome'
								decimalPlaces={0}
								isCurrency
								aria-labelledby='retirementIncomeLabel'
								value={profile.retirementIncome ?? ''}
								onChange={(value) => {
									setProfile((prev) => ({
										...prev,
										retirementIncome: value,
									}));
									setSelected((prev) => ({
										...prev,
										retirementIncome: value,
									}));
								}}
							/>
							<br />
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
							<div className='flex-row'>
								<div className='setup-retirement-grid'>
									<label htmlFor='inflationIncome'>Inflation - Income</label>
									<NumberInput
										id='inflationIncome'
										isPercent
										width='5rem'
										decimalPlaces={1}
										value={profile.inflationIncome ?? ''}
										onChange={(value) =>
											setProfile((prev) => ({
												...prev,
												inflationIncome: value,
											}))
										}
									/>
									<p></p>

									<label htmlFor='inflationExpenses'>Inflation - Expenses</label>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										id='inflationExpenses'
										value={profile.inflationExpenses ?? ''}
										onChange={(value) =>
											setProfile((prev) => ({
												...prev,
												inflationExpenses: value,
											}))
										}
									/>
									<p></p>
								</div>

								<div className='setup-retirement-grid three-input'>
									{/* PRE */}
									<label htmlFor='preRetirementReturn' id='preRetirementReturnLabel'>
										Pre-Retirement Return
									</label>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										id='preRetirementReturn'
										value={options.preRetirementReturn.one}
										onChange={(value) => {
											console.log('value:', value);
											updateOptions(value, 'one', 'preRetirementReturn');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										aria-labelledby='preRetirementReturnLabel'
										value={options.preRetirementReturn.two}
										onChange={(value) => {
											setSelected((prev) => ({ ...prev, preRetirementReturn: value }));
											updateOptions(value, 'two', 'preRetirementReturn');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										aria-labelledby='preRetirementReturnLabel'
										value={options.preRetirementReturn.three}
										onChange={(value) => updateOptions(value, 'three', 'preRetirementReturn')}
									/>

									{/* POST */}
									<label htmlFor='postRetirementReturn' id='postRetirementReturnLabel'>
										Post-Retirement Return
									</label>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										id='postRetirementReturn'
										value={options.postRetirementReturn.one}
										onChange={(value) => {
											console.log('value:', value);
											updateOptions(value, 'one', 'postRetirementReturn');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										aria-labelledby='postRetirementReturnLabel'
										value={options.postRetirementReturn.two}
										onChange={(value) => {
											setSelected((prev) => ({ ...prev, postRetirementReturn: value }));
											updateOptions(value, 'two', 'postRetirementReturn');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										aria-labelledby='postRetirementReturnLabel'
										value={options.postRetirementReturn.three}
										onChange={(value) => updateOptions(value, 'three', 'postRetirementReturn')}
									/>

									{/* Income */}
									<label htmlFor='retirementIncomeAdj' id='retirementIncomeAdjLabel'>
										Retirement Income
									</label>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										id='retirementIncomeAdj'
										value={options.retirementIncomeAdj.one}
										onChange={(value) => {
											console.log('value:', value);
											updateOptions(value, 'one', 'retirementIncomeAdj');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										aria-labelledby='retirementIncomeAdjLabel'
										value={options.retirementIncomeAdj.two}
										onChange={(value) => {
											updateOptions(value, 'two', 'retirementIncomeAdj');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5rem'
										aria-labelledby='retirementIncomeAdjLabel'
										value={options.retirementIncomeAdj.three}
										onChange={(value) => updateOptions(value, 'three', 'retirementIncomeAdj')}
									/>
								</div>
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

// Maybe have buttons by graph to show how different SSI ages affect scenarios?
// https://www.ssa.gov/cgi-bin/benefit6.cgi - use to figure out loose estimate ratios?
