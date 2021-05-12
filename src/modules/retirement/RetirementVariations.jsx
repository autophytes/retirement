import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/appContext';

const RetirementVariations = () => {
	const { profile, options, updateProfile } = useContext(AppContext);

	const [income, setIncome] = useState({ one: 0, two: 0, three: 0 });

	useEffect(() => {
		let newIncome = {};

		const numDigits = countDigits(profile.retirementIncome);

		for (let property in options.retirementIncomeAdj) {
			const value = options.retirementIncomeAdj[property];

			// Find the length of the whole numbers. Ex. countDigits(123.45) = 3
			const formatOptions = {
				maximumSignificantDigits: Math.max(numDigits - 3, 1),
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			};
			const formatObj = new Intl.NumberFormat('en-US', formatOptions);

			let newValue;
			if (value > 1000) {
				// Dollar value
				newValue = formatObj.format(value);
			} else {
				// Percentage
				newValue = formatObj.format(value * profile.retirementIncome);
			}

			newIncome[property + 'String'] = newValue;
			console.log('newIncome[property string]:', newIncome[property + 'String']);
			newIncome[property + 'Value'] = Number.parseFloat(newValue);
			console.log('newIncome[property value]:', newIncome[property + 'Value']);
		}

		setIncome(newIncome);
	}, [options.retirementIncomeAdj, profile.retirementIncome]);

	return (
		<>
			{/* PRE RETURN */}
			<div className='variation-section'>
				<h3>Pre-Retirement Return</h3>
				<div className='variation-section-buttons'>
					<button
						className={
							'variation-section-button' +
							(profile.preRetirementReturn === options.preRetirementReturn.one
								? ' active'
								: '')
						}
						onClick={() =>
							updateProfile(options.preRetirementReturn.one, 'preRetirementReturn')
						}>
						{(options.preRetirementReturn.one * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.preRetirementReturn === options.preRetirementReturn.two
								? ' active'
								: '')
						}
						onClick={() =>
							updateProfile(options.preRetirementReturn.two, 'preRetirementReturn')
						}>
						{(options.preRetirementReturn.two * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.preRetirementReturn === options.preRetirementReturn.three
								? ' active'
								: '')
						}
						onClick={() =>
							updateProfile(options.preRetirementReturn.three, 'preRetirementReturn')
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
							(profile.postRetirementReturn === options.postRetirementReturn.one
								? ' active'
								: '')
						}
						onClick={() =>
							updateProfile(options.postRetirementReturn.one, 'postRetirementReturn')
						}>
						{(options.postRetirementReturn.one * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.postRetirementReturn === options.postRetirementReturn.two
								? ' active'
								: '')
						}
						onClick={() =>
							updateProfile(options.postRetirementReturn.two, 'postRetirementReturn')
						}>
						{(options.postRetirementReturn.two * 100).toFixed(1)}%
					</button>

					<button
						className={
							'variation-section-button' +
							(profile.postRetirementReturn === options.postRetirementReturn.three
								? ' active'
								: '')
						}
						onClick={() =>
							updateProfile(options.postRetirementReturn.three, 'postRetirementReturn')
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
							(profile.retirementIncome === income.oneValue ? ' active' : '')
						}
						onClick={() => updateProfile(income.oneValue, 'retirementIncome')}>
						{income.oneString}
					</button>
					<button
						className={
							'variation-section-button' +
							(profile.retirementIncome === income.twoValue ? ' active' : '')
						}
						onClick={() => updateProfile(income.twoValue, 'retirementIncome')}>
						{income.twoString}
					</button>
					<button
						className={
							'variation-section-button' +
							(profile.retirementIncome === income.threeValue ? ' active' : '')
						}
						onClick={() => updateProfile(income.threeValue, 'retirementIncome')}>
						{income.threeString}
					</button>
				</div>
			</div>

			{/* RETIREMENT AGE */}
			<div className='variation-section'>
				<h3>Retirement Age</h3>
				<div className='variation-section-buttons'>
					<button
						className={
							'variation-section-button' +
							(profile.primary.retirementAge === 55 ? ' active' : '')
						}
						onClick={() => updateProfile(55, 'retirementAge', 'primary')}>
						55
					</button>
					<button
						className={
							'variation-section-button' +
							(profile.primary.retirementAge === 60 ? ' active' : '')
						}
						onClick={() => updateProfile(60, 'retirementAge', 'primary')}>
						60
					</button>
					<button
						className={
							'variation-section-button' +
							(profile.primary.retirementAge === 65 ? ' active' : '')
						}
						onClick={() => updateProfile(65, 'retirementAge', 'primary')}>
						65
					</button>
				</div>
			</div>

			{/* ANNUAL SAVINGS */}
			<div className='variation-section'>
				<h3>Savings</h3>
				<div className='variation-section-buttons'>
					<button
						className={
							'variation-section-button' +
							(profile.primary.annualSavings === 5000 ? ' active' : '')
						}
						onClick={() => updateProfile(5000, 'annualSavings', 'primary')}>
						$5,000
					</button>
					<button
						className={
							'variation-section-button' +
							(profile.primary.annualSavings === 10000 ? ' active' : '')
						}
						onClick={() => updateProfile(10000, 'annualSavings', 'primary')}>
						$10,000
					</button>
					<button
						className={
							'variation-section-button' +
							(profile.primary.annualSavings === 15000 ? ' active' : '')
						}
						onClick={() => updateProfile(15000, 'annualSavings', 'primary')}>
						$15,000
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
