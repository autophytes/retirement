import React, { Fragment, useContext, useState } from 'react';

import NumberInput from '../forms/NumberInput';
import CheckSVG from '../assets/CheckSVG';

import { AppContext } from '../context/appContext';

import Collapse from 'react-css-collapse';
import PlusSignCircleSVG from '../assets/PlusSignCircleSVG';

const Setup = () => {
	const { profile, setProfile, updateProfile, options, updateOptions, setSelected } =
		useContext(AppContext);

	const [showRetirement, setShowRetirement] = useState(true);
	const [showRetirementAdvanced, setShowRetirementAdvanced] = useState(true);

	const updateRetirementAge = (value, person) => {
		setSelected((prev) => ({ ...prev, [person + 'RetirementAge']: value }));
		updateProfile(value, 'retirementAge', person);

		const parentProperty =
			person === 'primary' ? 'retirementAgePrimary' : 'retirementAgeSpouse';
		updateOptions(value - 3, 'one', parentProperty);
		updateOptions(value, 'two', parentProperty);
		updateOptions(value + 3, 'three', parentProperty);
	};

	const updateFutureStream = (prop, incomeObj) => {
		// ID
		// Cash
		// Start years in future
		// Number of years

		// TODO - Mapping the future income and future savings objects

		setProfile((prev) => {
			let newProfile = {
				...prev,
				[prop]: [...prev[prop]],
			};

			const futureIndex = newProfile[prop].findIndex((item) => item.id === incomeObj.id);
			newProfile[prop][futureIndex] = incomeObj;

			return newProfile;
		});
	};

	const addFutureStream = (prop) => {
		let newStream = {
			id: profile[prop].reduce((acc, item) => (item.id > acc ? item.id : acc), 1) + 1,
			value: '',
			yearStart: '',
			numYears: '',
		};

		setProfile((prev) => {
			let newProfile = {
				...prev,
				[prop]: [...prev[prop]],
			};

			newProfile[prop].push(newStream);

			return newProfile;
		});
	};

	const deleteFutureStream = (prop, id) => {
		const newStream = {
			id: 1,
			value: '',
			yearStart: '',
			numYears: '',
		};

		const index = profile[prop].findIndex((item) => item.id === id);

		setProfile((prev) => {
			let newProfile = {
				...prev,
				[prop]: [...prev[prop]],
			};

			newProfile[prop].splice(index, 1);

			newProfile[prop].length === 0 && newProfile[prop].push(newStream);

			return newProfile;
		});
	};

	return (
		<>
			<section className='setup-section'>
				{/* RETIREMENT */}
				<h3 className='setup-section-title' onClick={() => setShowRetirement((prev) => !prev)}>
					Retirement Settings
				</h3>

				<Collapse isOpen={showRetirement}>
					{/* BASIC SETTINGS */}
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
								onChange={(value) => updateRetirementAge(value, 'primary')}
							/>
							<NumberInput
								decimalPlaces={0}
								max={120}
								aria-labelledby='spouseColumn retirementAgeLabel'
								value={profile.spouse.retirementAge ?? ''}
								onChange={(value) => updateRetirementAge(value, 'spouse')}
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
								onChange={(value) => {
									setSelected((prev) => ({ ...prev, primarySavings: value }));
									updateProfile(value, 'annualSavings', 'primary');
								}}
							/>
							<NumberInput
								decimalPlaces={0}
								isCurrency
								aria-labelledby='spouseColumn annualSavingsLabel'
								value={profile.spouse.annualSavings ?? ''}
								onChange={(value) => {
									setSelected((prev) => ({ ...prev, primarySavings: value }));
									updateProfile(value, 'annualSavings', 'spouse');
								}}
							/>

							{/* PENSION */}
							<label htmlFor='pension' id='pensionLabel'>
								Pension
							</label>
							<NumberInput
								decimalPlaces={0}
								isCurrency
								id='pension'
								aria-labelledby='primaryColumn pensionLabel'
								value={profile.primary.pension ?? ''}
								onChange={(value) => updateProfile(value, 'pension', 'primary')}
							/>
							<NumberInput
								decimalPlaces={0}
								isCurrency
								aria-labelledby='spouseColumn pensionLabel'
								value={profile.spouse.pension ?? ''}
								onChange={(value) => updateProfile(value, 'pension', 'spouse')}
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

					{/* FUTURE CASH FLOWS */}
					<div className='flex-row'>
						<div className='setup-retirement-grid four-input'>
							{/* PRE */}
							<label id='futureSavings' style={{ display: 'flex', alignItems: 'center' }}>
								Future Savings
								<button
									onClick={() => addFutureStream('futureSavings')}
									className='setup-retirement-add-button'>
									<PlusSignCircleSVG />
								</button>
							</label>
							{profile.futureSavings.map((item, i) => (
								<Fragment key={item.id}>
									{i === 0 ? null : <span />}
									<NumberInput
										isCurrency
										decimalPlaces={2}
										aria-labelledby='futureSavings'
										value={item.value}
										onChange={(newValue) => {
											updateFutureStream('futureSavings', {
												...item,
												value: newValue,
											});
										}}
									/>
									<NumberInput
										decimalPlaces={0}
										width='5rem'
										aria-labelledby='futureSavings'
										value={item.yearStart}
										onChange={(newValue) => {
											updateFutureStream('futureSavings', {
												...item,
												yearStart: newValue,
											});
										}}
									/>
									<NumberInput
										decimalPlaces={0}
										width='5rem'
										aria-labelledby='futureSavings'
										value={item.numYears}
										onChange={(newValue) => {
											updateFutureStream('futureSavings', {
												...item,
												numYears: newValue,
											});
										}}
									/>
									<button onClick={() => deleteFutureStream('futureSavings', item.id)}>
										Delete
									</button>
								</Fragment>
							))}
						</div>
						<div className='setup-retirement-grid four-input'>
							{/* PRE */}
							<label id='futureIncomes' style={{ display: 'flex', alignItems: 'center' }}>
								Future Income
								<button
									onClick={() => addFutureStream('futureIncomes')}
									className='setup-retirement-add-button'>
									<PlusSignCircleSVG />
								</button>
							</label>
							{profile.futureIncomes.map((item, i) => (
								<Fragment key={item.id}>
									{i === 0 ? null : <span />}
									<NumberInput
										isCurrency
										decimalPlaces={2}
										aria-labelledby='futureIncomes'
										value={item.value}
										onChange={(newValue) => {
											updateFutureStream('futureIncomes', {
												...item,
												value: newValue,
											});
										}}
									/>
									<NumberInput
										decimalPlaces={0}
										width='5rem'
										aria-labelledby='futureIncomes'
										value={item.yearStart}
										onChange={(newValue) => {
											updateFutureStream('futureIncomes', {
												...item,
												yearStart: newValue,
											});
										}}
									/>

									<NumberInput
										decimalPlaces={0}
										width='5rem'
										aria-labelledby='futureIncomes'
										value={item.numYears}
										onChange={(newValue) => {
											updateFutureStream('futureIncomes', {
												...item,
												numYears: newValue,
											});
										}}
									/>
									<button onClick={() => deleteFutureStream('futureIncomes', item.id)}>
										Delete
									</button>
								</Fragment>
							))}
						</div>
					</div>

					{/* ADVANCED SETTINGS */}
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

									<label htmlFor='inflationExpenses'>Income - Both Retired</label>
									<button
										className={'checkbox ' + (profile.drawIncomeAfterBothRetired && 'checked')}
										onClick={() =>
											setProfile((prev) => ({
												...prev,
												drawIncomeAfterBothRetired: !prev.drawIncomeAfterBothRetired,
											}))
										}>
										<CheckSVG />
									</button>
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
										isPercent={options.retirementIncomeAdj.one < 10}
										decimalPlaces={options.retirementIncomeAdj.one < 10 ? 1 : 0}
										width='5rem'
										id='retirementIncomeAdj'
										value={options.retirementIncomeAdj.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'retirementIncomeAdj');
										}}
									/>
									<NumberInput
										isPercent={options.retirementIncomeAdj.two < 10}
										decimalPlaces={options.retirementIncomeAdj.two < 10 ? 1 : 0}
										width='5rem'
										aria-labelledby='retirementIncomeAdjLabel'
										value={options.retirementIncomeAdj.two}
										onChange={(value) => {
											updateOptions(value, 'two', 'retirementIncomeAdj');
										}}
									/>
									<NumberInput
										isPercent={options.retirementIncomeAdj.three < 10}
										decimalPlaces={options.retirementIncomeAdj.three < 10 ? 1 : 0}
										width='5rem'
										aria-labelledby='retirementIncomeAdjLabel'
										value={options.retirementIncomeAdj.three}
										onChange={(value) => updateOptions(value, 'three', 'retirementIncomeAdj')}
									/>

									{/* Primary Savings */}
									<label htmlFor='primarySavingsAdj' id='primarySavingsAdjLabel'>
										Savings - Primary
									</label>
									<NumberInput
										isPercent={options.primarySavingsAdj.one < 10}
										decimalPlaces={options.primarySavingsAdj.one < 10 ? 1 : 0}
										width='5rem'
										id='primarySavingsAdj'
										value={options.primarySavingsAdj.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'primarySavingsAdj');
										}}
									/>
									<NumberInput
										isPercent={options.primarySavingsAdj.two < 10}
										decimalPlaces={options.primarySavingsAdj.two < 10 ? 1 : 0}
										width='5rem'
										aria-labelledby='primarySavingsAdjLabel'
										value={options.primarySavingsAdj.two}
										onChange={(value) => {
											updateOptions(value, 'two', 'primarySavingsAdj');
										}}
									/>
									<NumberInput
										isPercent={options.primarySavingsAdj.three < 10}
										decimalPlaces={options.primarySavingsAdj.three < 10 ? 1 : 0}
										width='5rem'
										aria-labelledby='primarySavingsAdjLabel'
										value={options.primarySavingsAdj.three}
										onChange={(value) => updateOptions(value, 'three', 'primarySavingsAdj')}
									/>

									{/* Spouse Savings */}
									<label htmlFor='spouseSavingsAdj' id='spouseSavingsAdjLabel'>
										Savings - Spouse
									</label>
									<NumberInput
										isPercent={options.spouseSavingsAdj.one < 10}
										decimalPlaces={options.spouseSavingsAdj.one < 10 ? 1 : 0}
										width='5rem'
										id='spouseSavingsAdj'
										value={options.spouseSavingsAdj.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'spouseSavingsAdj');
										}}
									/>
									<NumberInput
										isPercent={options.spouseSavingsAdj.two < 10}
										decimalPlaces={options.spouseSavingsAdj.two < 10 ? 1 : 0}
										width='5rem'
										aria-labelledby='spouseSavingsAdjLabel'
										value={options.spouseSavingsAdj.two}
										onChange={(value) => {
											updateOptions(value, 'two', 'spouseSavingsAdj');
										}}
									/>
									<NumberInput
										isPercent={options.spouseSavingsAdj.three < 10}
										decimalPlaces={options.spouseSavingsAdj.three < 10 ? 1 : 0}
										width='5rem'
										aria-labelledby='spouseSavingsAdjLabel'
										value={options.spouseSavingsAdj.three}
										onChange={(value) => updateOptions(value, 'three', 'spouseSavingsAdj')}
									/>

									{/* Age - Primary */}
									<label htmlFor='retirementAgePrimary' id='retirementAgePrimaryLabel'>
										Retirement Age - Primary
									</label>
									<NumberInput
										decimalPlaces={0}
										width='5rem'
										id='retirementAgePrimary'
										value={options.retirementAgePrimary.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'retirementAgePrimary');
										}}
									/>
									<span />
									<NumberInput
										decimalPlaces={0}
										width='5rem'
										aria-labelledby='retirementAgePrimaryLabel'
										value={options.retirementAgePrimary.three}
										onChange={(value) => updateOptions(value, 'three', 'retirementAgePrimary')}
									/>

									{/* Age - Spouse */}
									<label htmlFor='retirementAgeSpouse' id='retirementAgeSpouseLabel'>
										Retirement Age - Spouse
									</label>
									<NumberInput
										decimalPlaces={0}
										width='5rem'
										id='retirementAgeSpouse'
										value={options.retirementAgeSpouse.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'retirementAgeSpouse');
										}}
									/>
									<span />
									<NumberInput
										decimalPlaces={0}
										width='5rem'
										aria-labelledby='retirementAgeSpouseLabel'
										value={options.retirementAgeSpouse.three}
										onChange={(value) => updateOptions(value, 'three', 'retirementAgeSpouse')}
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
