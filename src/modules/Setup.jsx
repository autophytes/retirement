import React, { Fragment, useContext, useEffect, useState } from 'react';

import NumberInput from '../forms/NumberInput';
import CheckSVG from '../assets/CheckSVG';

import { AppContext } from '../context/appContext';

import Collapse from 'react-css-collapse';
import PlusSignCircleSVG from '../assets/PlusSignCircleSVG';
import CaratDownSVG from '../assets/CaratDownSVG';
import CloseSVG from '../assets/CloseSVG';
import numeral from 'numeral';

const Setup = ({ clientName, setClientName }) => {
	const {
		profile,
		setProfile,
		updateProfile,
		options,
		updateOptions,
		setSelected,
		setButtonOptions,
	} = useContext(AppContext);

	const [showRetirement, setShowRetirement] = useState(true);
	const [showRetirementAdvanced, setShowRetirementAdvanced] = useState(true);
	const [editingName, setEditingName] = useState(false);

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
			ageStart: '',
			numYears: '',
			shouldInflate: false,
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
			ageStart: '',
			numYears: '',
			shouldInflate: false,
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

	// Calculate retirement income buttons
	useEffect(() => {
		let newIncome = {};

		for (let property in options.retirementIncomeAdj) {
			const baseValue = options.retirementIncomeAdj[property];
			const newValue = baseValue > 1000 ? baseValue : baseValue * profile.retirementIncome;

			const numDigits = countDigits(newValue);

			// Find the length of the whole numbers. Ex. countDigits(123.45) = 3
			const formatOptions = {
				maximumSignificantDigits: Math.max(numDigits - 3, 1),
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			};
			const formatObj = new Intl.NumberFormat('en-US', formatOptions);
			const finalValue = formatObj.format(newValue);

			newIncome[property + 'String'] = finalValue;
			newIncome[property + 'Value'] = numeral(finalValue).value();
		}

		setButtonOptions((prev) => ({ ...prev, income: newIncome }));
		// setIncome(newIncome);
	}, [options.retirementIncomeAdj, profile.retirementIncome]);

	// Calculate annual savings buttons
	useEffect(() => {
		let newPrimarySavings = {};
		let newSpouseSavings = {};

		for (let property in options.primarySavingsAdj) {
			const baseValue = options.primarySavingsAdj[property];
			const newValue =
				baseValue > 1000 ? baseValue : baseValue * profile.primary.annualSavings;
			console.log('newValue:', newValue);

			const numDigits = countDigits(newValue);

			// Find the length of the whole numbers. Ex. countDigits(123.45) = 3
			// subtract 2 to round to the nearest hundred
			const formatOptions = {
				maximumSignificantDigits: Math.max(numDigits - 2, 1),
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			};
			const formatObj = new Intl.NumberFormat('en-US', formatOptions);
			const finalValue = formatObj.format(newValue);

			console.log('finalValue:', finalValue);
			newPrimarySavings[property + 'String'] = finalValue;
			console.log('numeral(finalValue).value():', numeral(finalValue).value());
			newPrimarySavings[property + 'Value'] = numeral(finalValue).value();
		}

		for (let property in options.spouseSavingsAdj) {
			const baseValue = options.spouseSavingsAdj[property];
			const newValue = baseValue > 1000 ? baseValue : baseValue * profile.spouse.annualSavings;

			const numDigits = countDigits(newValue);

			// Find the length of the whole numbers. Ex. countDigits(123.45) = 3
			// subtract 2 to round to the nearest hundred
			const formatOptions = {
				maximumSignificantDigits: Math.max(numDigits - 2, 1),
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			};
			const formatObj = new Intl.NumberFormat('en-US', formatOptions);
			const finalValue = formatObj.format(newValue);

			newSpouseSavings[property + 'String'] = finalValue;
			newSpouseSavings[property + 'Value'] = numeral(finalValue).value();
		}

		setButtonOptions((prev) => ({
			...prev,
			savings: {
				primary: newPrimarySavings,
				spouse: newSpouseSavings,
			},
		}));

		// setSavings({
		// 	primary: newPrimarySavings,
		// 	spouse: newSpouseSavings,
		// });
	}, [
		options.primarySavingsAdj,
		options.spouseSavingsAdj,
		profile.primary.annualSavings,
		profile.spouse.annualSavings,
	]);

	return (
		<>
			{/* CONTACT NAME */}
			<div className='dashboard-section'>
				{editingName ? (
					<input
						type='text'
						className='client-name-title-input'
						autoFocus
						value={clientName}
						size={clientName.length}
						onFocus={(e) => e.target.select()}
						onChange={(e) => setClientName(e.target.value)}
						onBlur={(e) => {
							setClientName(e.target.value || 'Sample Plan');
							setEditingName(false);
						}}
					/>
				) : (
					<h2 className='client-name-title' onClick={() => setEditingName(true)}>
						{clientName}
					</h2>
				)}
			</div>

			{/* RETIREMENT */}
			<div className='dashboard-section'>
				<div
					className='setup-section-title-row'
					onClick={() => setShowRetirement((prev) => !prev)}>
					<span className={'setup-section-title-svg' + (!showRetirement ? ' closed' : '')}>
						<CaratDownSVG />
					</span>
					<h3 className='setup-section-title'>Retirement Settings</h3>
				</div>

				<Collapse isOpen={showRetirement}>
					{/* BASIC SETTINGS */}
					<div className='flex-row'>
						<div className='setup-retirement-grid' style={{ marginRight: '2rem' }}>
							{/* Frequent Settings */}

							<p></p>
							<label id='primaryColumn' style={{ textAlign: 'center', lineHeight: '1rem' }}>
								Primary
							</label>
							<div className='flex-row center' style={{ justifyContent: 'center' }}>
								<label id='spouseColumn' style={{ textAlign: 'center', lineHeight: '1rem' }}>
									Spouse
								</label>
								<button
									className={'checkbox small ' + (!profile.spouse.isNoSpouse && 'checked')}
									style={{ justifySelf: 'center' }}
									onClick={() => {
										updateProfile(!profile.spouse.isNoSpouse, 'isNoSpouse', 'spouse');
									}}>
									<CheckSVG />
								</button>
							</div>

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
								disabled={profile.spouse.isNoSpouse}
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
								disabled={profile.spouse.isNoSpouse}
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
								disabled={profile.spouse.isNoSpouse}
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
								disabled={profile.spouse.isNoSpouse}
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
								disabled={profile.spouse.isNoSpouse}
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

					{/* FUTURE SAVINGS */}
					<div className='setup-retirement-grid four-input'>
						<p></p>
						<label style={{ textAlign: 'center' }}>Value</label>
						<label style={{ textAlign: 'center' }}>At Age</label>
						<label style={{ textAlign: 'center' }}>Duration</label>
						<label style={{ textAlign: 'center', margin: '0' }}>Inflate</label>
						<p></p>

						{/* PRE */}
						<div className='flex-row center'>
							<label
								id='futureSavings'
								style={{ display: 'flex', alignItems: 'center', marginRight: '0' }}>
								Future Savings
							</label>
							<button
								onClick={() => addFutureStream('futureSavings')}
								className='setup-retirement-add-button'>
								<PlusSignCircleSVG />
							</button>
						</div>
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
									width='5.75rem'
									aria-labelledby='futureSavings'
									value={item.ageStart}
									onChange={(newValue) => {
										updateFutureStream('futureSavings', {
											...item,
											ageStart: newValue,
										});
									}}
								/>
								<NumberInput
									decimalPlaces={0}
									width='5.75rem'
									aria-labelledby='futureSavings'
									value={item.numYears}
									onChange={(newValue) => {
										updateFutureStream('futureSavings', {
											...item,
											numYears: newValue,
										});
									}}
								/>
								<button
									className={'checkbox ' + (item.shouldInflate && 'checked')}
									style={{ justifySelf: 'center' }}
									onClick={() => {
										updateFutureStream('futureSavings', {
											...item,
											shouldInflate: !item.shouldInflate,
										});
									}}>
									<CheckSVG />
								</button>
								<button
									className='setup-delete-button'
									onClick={() => deleteFutureStream('futureSavings', item.id)}>
									<CloseSVG />
								</button>
							</Fragment>
						))}

						{/* FUTURE INCOME */}
						{/* PRE */}
						<div className='flex-row center'>
							<label
								id='futureIncomes'
								style={{ display: 'flex', alignItems: 'center', marginRight: '0' }}>
								Future Income
							</label>
							<button
								onClick={() => addFutureStream('futureIncomes')}
								className='setup-retirement-add-button'>
								<PlusSignCircleSVG />
							</button>
						</div>
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
									width='5.75rem'
									aria-labelledby='futureIncomes'
									value={item.ageStart}
									onChange={(newValue) => {
										updateFutureStream('futureIncomes', {
											...item,
											ageStart: newValue,
										});
									}}
								/>

								<NumberInput
									decimalPlaces={0}
									width='5.75rem'
									aria-labelledby='futureIncomes'
									value={item.numYears}
									onChange={(newValue) => {
										updateFutureStream('futureIncomes', {
											...item,
											numYears: newValue,
										});
									}}
								/>
								<button
									className={'checkbox ' + (item.shouldInflate && 'checked')}
									style={{ justifySelf: 'center' }}
									onClick={() => {
										updateFutureStream('futureIncomes', {
											...item,
											shouldInflate: !item.shouldInflate,
										});
									}}>
									<CheckSVG />
								</button>
								<button
									className='setup-delete-button'
									onClick={() => deleteFutureStream('futureIncomes', item.id)}>
									<CloseSVG />
								</button>
							</Fragment>
						))}
					</div>

					{/* ADVANCED SETTINGS */}
					<div className='setup-retirement-additional-section'>
						{/* RETIREMENT */}
						<div
							className='setup-section-title-row'
							onClick={() => setShowRetirementAdvanced((prev) => !prev)}>
							<span
								className={
									'setup-section-title-svg additional-title' +
									(!showRetirementAdvanced ? ' closed' : '')
								}>
								<CaratDownSVG />
							</span>
							<h3 className='setup-retirement-additional-title'>Additional Options</h3>
						</div>

						<Collapse isOpen={showRetirementAdvanced}>
							<div className='flex-row'>
								<div className='setup-retirement-grid'>
									<label htmlFor='inflationIncome'>Inflation - Income</label>
									<NumberInput
										id='inflationIncome'
										isPercent
										width='5.75rem'
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
										width='5.75rem'
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
										width='5.75rem'
										id='preRetirementReturn'
										value={options.preRetirementReturn.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'preRetirementReturn');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5.75rem'
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
										width='5.75rem'
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
										width='5.75rem'
										id='postRetirementReturn'
										value={options.postRetirementReturn.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'postRetirementReturn');
										}}
									/>
									<NumberInput
										isPercent
										decimalPlaces={1}
										width='5.75rem'
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
										width='5.75rem'
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
										width='5.75rem'
										id='retirementIncomeAdj'
										value={options.retirementIncomeAdj.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'retirementIncomeAdj');
										}}
									/>
									<NumberInput
										isPercent={options.retirementIncomeAdj.two < 10}
										decimalPlaces={options.retirementIncomeAdj.two < 10 ? 1 : 0}
										width='5.75rem'
										aria-labelledby='retirementIncomeAdjLabel'
										value={options.retirementIncomeAdj.two}
										onChange={(value) => {
											updateOptions(value, 'two', 'retirementIncomeAdj');
										}}
									/>
									<NumberInput
										isPercent={options.retirementIncomeAdj.three < 10}
										decimalPlaces={options.retirementIncomeAdj.three < 10 ? 1 : 0}
										width='5.75rem'
										aria-labelledby='retirementIncomeAdjLabel'
										value={options.retirementIncomeAdj.three}
										onChange={(value) => updateOptions(value, 'three', 'retirementIncomeAdj')}
									/>

									{/* Primary Savings */}
									<label htmlFor='primarySavingsAdj' id='primarySavingsAdjLabel'>
										Savings{profile.spouse.isNoSpouse ? '' : ' - Primary'}
									</label>
									<NumberInput
										isPercent={options.primarySavingsAdj.one < 10}
										decimalPlaces={options.primarySavingsAdj.one < 10 ? 1 : 0}
										width='5.75rem'
										id='primarySavingsAdj'
										value={options.primarySavingsAdj.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'primarySavingsAdj');
										}}
									/>
									<NumberInput
										isPercent={options.primarySavingsAdj.two < 10}
										decimalPlaces={options.primarySavingsAdj.two < 10 ? 1 : 0}
										width='5.75rem'
										aria-labelledby='primarySavingsAdjLabel'
										value={options.primarySavingsAdj.two}
										onChange={(value) => {
											updateOptions(value, 'two', 'primarySavingsAdj');
										}}
									/>
									<NumberInput
										isPercent={options.primarySavingsAdj.three < 10}
										decimalPlaces={options.primarySavingsAdj.three < 10 ? 1 : 0}
										width='5.75rem'
										aria-labelledby='primarySavingsAdjLabel'
										value={options.primarySavingsAdj.three}
										onChange={(value) => updateOptions(value, 'three', 'primarySavingsAdj')}
									/>

									{/* Spouse Savings */}
									{!profile.spouse.isNoSpouse && (
										<>
											<label htmlFor='spouseSavingsAdj' id='spouseSavingsAdjLabel'>
												Savings - Spouse
											</label>
											<NumberInput
												isPercent={options.spouseSavingsAdj.one < 10}
												decimalPlaces={options.spouseSavingsAdj.one < 10 ? 1 : 0}
												width='5.75rem'
												id='spouseSavingsAdj'
												value={options.spouseSavingsAdj.one}
												onChange={(value) => {
													updateOptions(value, 'one', 'spouseSavingsAdj');
												}}
											/>
											<NumberInput
												isPercent={options.spouseSavingsAdj.two < 10}
												decimalPlaces={options.spouseSavingsAdj.two < 10 ? 1 : 0}
												width='5.75rem'
												aria-labelledby='spouseSavingsAdjLabel'
												value={options.spouseSavingsAdj.two}
												onChange={(value) => {
													updateOptions(value, 'two', 'spouseSavingsAdj');
												}}
											/>
											<NumberInput
												isPercent={options.spouseSavingsAdj.three < 10}
												decimalPlaces={options.spouseSavingsAdj.three < 10 ? 1 : 0}
												width='5.75rem'
												aria-labelledby='spouseSavingsAdjLabel'
												value={options.spouseSavingsAdj.three}
												onChange={(value) => updateOptions(value, 'three', 'spouseSavingsAdj')}
											/>
										</>
									)}

									{/* Age - Primary */}
									<label htmlFor='retirementAgePrimary' id='retirementAgePrimaryLabel'>
										Retirement Age{profile.spouse.isNoSpouse ? '' : ' - Primary'}
									</label>
									<NumberInput
										decimalPlaces={0}
										width='5.75rem'
										id='retirementAgePrimary'
										value={options.retirementAgePrimary.one}
										onChange={(value) => {
											updateOptions(value, 'one', 'retirementAgePrimary');
										}}
									/>
									<span />
									<NumberInput
										decimalPlaces={0}
										width='5.75rem'
										aria-labelledby='retirementAgePrimaryLabel'
										value={options.retirementAgePrimary.three}
										onChange={(value) => updateOptions(value, 'three', 'retirementAgePrimary')}
									/>

									{/* Age - Spouse */}
									{!profile.spouse.isNoSpouse && (
										<>
											<label htmlFor='retirementAgeSpouse' id='retirementAgeSpouseLabel'>
												Retirement Age - Spouse
											</label>
											<NumberInput
												decimalPlaces={0}
												width='5.75rem'
												id='retirementAgeSpouse'
												value={options.retirementAgeSpouse.one}
												onChange={(value) => {
													updateOptions(value, 'one', 'retirementAgeSpouse');
												}}
											/>
											<span />
											<NumberInput
												decimalPlaces={0}
												width='5.75rem'
												aria-labelledby='retirementAgeSpouseLabel'
												value={options.retirementAgeSpouse.three}
												onChange={(value) =>
													updateOptions(value, 'three', 'retirementAgeSpouse')
												}
											/>
										</>
									)}
								</div>
							</div>
						</Collapse>
					</div>
				</Collapse>
			</div>

			{/* COLLEGE */}
			<div className='dashboard-section'>
				<div className='setup-section-title-row'>
					<span className='setup-section-title-svg closed'>
						<CaratDownSVG />
					</span>
					<h3 className='setup-section-title'>College Settings</h3>
				</div>
				<div style={{ height: '1px' }} />
			</div>

			{/* DEBT */}
			<div className='dashboard-section'>
				<div className='setup-section-title-row'>
					<span className='setup-section-title-svg closed'>
						<CaratDownSVG />
					</span>
					<h3 className='setup-section-title'>Debt Settings</h3>
				</div>
				<div style={{ height: '1px' }} />
			</div>

			{/* SOCIAL SECURITY */}
			<div className='dashboard-section'>
				<div className='setup-section-title-row'>
					<span className='setup-section-title-svg closed'>
						<CaratDownSVG />
					</span>
					<h3 className='setup-section-title'>Social Security Settings</h3>
				</div>
				<div style={{ height: '1px' }} />
			</div>
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

// Finds the number of whole-number digits. Recursive.
const countDigits = (number, count = 0) => {
	// If we haven't rounded down to zero yet, keep incrementing
	if (number) {
		return countDigits(Math.floor(number / 10), ++count);
	} else {
		// Return the final digit count
		return count;
	}
};
