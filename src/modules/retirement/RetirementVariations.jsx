import numeral from 'numeral';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/appContext';

const RetirementVariations = () => {
	const { profile, options, updateProfile, selected, setSelected } = useContext(AppContext);

	const [income, setIncome] = useState({ one: 0, two: 0, three: 0 });
	const [savings, setSavings] = useState({
		primary: {},
		spouse: {},
	});

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

		setIncome(newIncome);
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

		setSavings({
			primary: newPrimarySavings,
			spouse: newSpouseSavings,
		});
	}, [
		options.primarySavingsAdj,
		options.spouseSavingsAdj,
		profile.primary.annualSavings,
		profile.spouse.annualSavings,
	]);

	return (
		<>
			{/* PRE RETURN */}
			<div className='variation-section'>
				<h3>Pre-Retirement Return</h3>
				<div className='variation-section-buttons'>
					<button
						className={
							'variation-section-button' +
							(selected.preRetirementReturn === options.preRetirementReturn.one
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								preRetirementReturn: options.preRetirementReturn.one,
							}))
						}>
						{(options.preRetirementReturn.one * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(selected.preRetirementReturn === options.preRetirementReturn.two
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								preRetirementReturn: options.preRetirementReturn.two,
							}))
						}>
						{(options.preRetirementReturn.two * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(selected.preRetirementReturn === options.preRetirementReturn.three
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								preRetirementReturn: options.preRetirementReturn.three,
							}))
						}>
						{(options.preRetirementReturn.three * 100).toFixed(1)}%
					</button>
				</div>
			</div>

			{/* POST RETURN */}
			<div className='variation-section'>
				<h3>Post-Retirement Return</h3>
				<div className='variation-section-buttons'>
					<button
						className={
							'variation-section-button' +
							(selected.postRetirementReturn === options.postRetirementReturn.one
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								postRetirementReturn: options.postRetirementReturn.one,
							}))
						}>
						{(options.postRetirementReturn.one * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(selected.postRetirementReturn === options.postRetirementReturn.two
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								postRetirementReturn: options.postRetirementReturn.two,
							}))
						}>
						{(options.postRetirementReturn.two * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(selected.postRetirementReturn === options.postRetirementReturn.three
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								postRetirementReturn: options.postRetirementReturn.three,
							}))
						}>
						{(options.postRetirementReturn.three * 100).toFixed(1)}%
					</button>
				</div>
			</div>

			{/* RETIREMENT INCOME */}
			<div className='variation-section'>
				<h3>Income</h3>
				<div className='variation-section-buttons'>
					<button
						className={
							'variation-section-button' +
							(selected.retirementIncome === income.oneValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({ ...prev, retirementIncome: income.oneValue }))
						}>
						{income.oneString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.retirementIncome === income.twoValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({ ...prev, retirementIncome: income.twoValue }))
						}>
						{income.twoString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.retirementIncome === income.threeValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({ ...prev, retirementIncome: income.threeValue }))
						}>
						{income.threeString}
					</button>
				</div>
			</div>

			{/* RETIREMENT AGE */}
			<div className='variation-section'>
				<h3>Retirement Age</h3>

				{/* PRIMARY */}
				<div className='variation-section-buttons'>
					<span className='variation-section-button-subtitle'>Primary</span>
				</div>
				<div
					className='variation-section-buttons'
					style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
					<button
						className={
							'variation-section-button' +
							(selected.primaryRetirementAge === options.retirementAgePrimary.one
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primaryRetirementAge: options.retirementAgePrimary.one,
							}))
						}>
						{options.retirementAgePrimary.one}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.primaryRetirementAge === options.retirementAgePrimary.two
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primaryRetirementAge: options.retirementAgePrimary.two,
							}))
						}>
						{options.retirementAgePrimary.two}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.primaryRetirementAge === options.retirementAgePrimary.three
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primaryRetirementAge: options.retirementAgePrimary.three,
							}))
						}>
						{options.retirementAgePrimary.three}
					</button>
				</div>
				{/* SPOUSE */}
				<div className='variation-section-buttons'>
					<span className='variation-section-button-subtitle'>Spouse</span>
				</div>
				<div
					className='variation-section-buttons'
					style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
					<button
						className={
							'variation-section-button' +
							(selected.spouseRetirementAge === options.retirementAgeSpouse.one
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseRetirementAge: options.retirementAgeSpouse.one,
							}))
						}>
						{options.retirementAgeSpouse.one}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.spouseRetirementAge === options.retirementAgeSpouse.two
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseRetirementAge: options.retirementAgeSpouse.two,
							}))
						}>
						{options.retirementAgeSpouse.two}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.spouseRetirementAge === options.retirementAgeSpouse.three
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseRetirementAge: options.retirementAgeSpouse.three,
							}))
						}>
						{options.retirementAgeSpouse.three}
					</button>
				</div>
			</div>

			{/* ANNUAL SAVINGS */}
			<div className='variation-section'>
				<h3>Savings</h3>

				{/* PRIMARY */}
				<div className='variation-section-buttons'>
					<span className='variation-section-button-subtitle'>Primary</span>
				</div>
				<div
					className='variation-section-buttons'
					style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
					<button
						className={
							'variation-section-button' +
							(selected.primarySavings === savings.primary.oneValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primarySavings: savings.primary.oneValue,
							}))
						}>
						{savings.primary.oneString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.primarySavings === savings.primary.twoValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primarySavings: savings.primary.twoValue,
							}))
						}>
						{savings.primary.twoString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.primarySavings === savings.primary.threeValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primarySavings: savings.primary.threeValue,
							}))
						}>
						{savings.primary.threeString}
					</button>
				</div>

				{/* SPOUSE */}
				<div className='variation-section-buttons'>
					<span className='variation-section-button-subtitle'>Spouse</span>
				</div>
				<div
					className='variation-section-buttons'
					style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
					<button
						className={
							'variation-section-button' +
							(selected.spouseSavings === savings.spouse.oneValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseSavings: savings.spouse.oneValue,
							}))
						}>
						{savings.spouse.oneString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.spouseSavings === savings.spouse.twoValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseSavings: savings.spouse.twoValue,
							}))
						}>
						{savings.spouse.twoString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.spouseSavings === savings.spouse.threeValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseSavings: savings.spouse.threeValue,
							}))
						}>
						{savings.spouse.threeString}
					</button>
				</div>
			</div>
		</>
	);
};

export default RetirementVariations;

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
