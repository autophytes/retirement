import numeral from 'numeral';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/appContext';

const RetirementVariations = () => {
	const { profile, options, updateProfile, selected, setSelected, buttonOptions } =
		useContext(AppContext);

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
							(selected.retirementIncome === buttonOptions.income.oneValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								retirementIncome: buttonOptions.income.oneValue,
							}))
						}>
						{buttonOptions.income.oneString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.retirementIncome === buttonOptions.income.twoValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								retirementIncome: buttonOptions.income.twoValue,
							}))
						}>
						{buttonOptions.income.twoString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.retirementIncome === buttonOptions.income.threeValue ? ' active' : '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								retirementIncome: buttonOptions.income.threeValue,
							}))
						}>
						{buttonOptions.income.threeString}
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
				<div className='variation-section-buttons' style={{ margin: '0.5rem 0 0.5rem 1rem' }}>
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
				<div className='variation-section-buttons' style={{ margin: '0.5rem 0 0.5rem 1rem' }}>
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
				<div className='variation-section-buttons' style={{ margin: '0.5rem 0 0.5rem 1rem' }}>
					<button
						className={
							'variation-section-button' +
							(selected.primarySavings === buttonOptions.savings.primary.oneValue
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primarySavings: buttonOptions.savings.primary.oneValue,
							}))
						}>
						{buttonOptions.savings.primary.oneString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.primarySavings === buttonOptions.savings.primary.twoValue
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primarySavings: buttonOptions.savings.primary.twoValue,
							}))
						}>
						{buttonOptions.savings.primary.twoString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.primarySavings === buttonOptions.savings.primary.threeValue
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								primarySavings: buttonOptions.savings.primary.threeValue,
							}))
						}>
						{buttonOptions.savings.primary.threeString}
					</button>
				</div>

				{/* SPOUSE */}
				<div className='variation-section-buttons'>
					<span className='variation-section-button-subtitle'>Spouse</span>
				</div>
				<div className='variation-section-buttons' style={{ margin: '0.5rem 0 0.5rem 1rem' }}>
					<button
						className={
							'variation-section-button' +
							(selected.spouseSavings === buttonOptions.savings.spouse.oneValue
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseSavings: buttonOptions.savings.spouse.oneValue,
							}))
						}>
						{buttonOptions.savings.spouse.oneString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.spouseSavings === buttonOptions.savings.spouse.twoValue
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseSavings: buttonOptions.savings.spouse.twoValue,
							}))
						}>
						{buttonOptions.savings.spouse.twoString}
					</button>
					<button
						className={
							'variation-section-button' +
							(selected.spouseSavings === buttonOptions.savings.spouse.threeValue
								? ' active'
								: '')
						}
						onClick={() =>
							setSelected((prev) => ({
								...prev,
								spouseSavings: buttonOptions.savings.spouse.threeValue,
							}))
						}>
						{buttonOptions.savings.spouse.threeString}
					</button>
				</div>
			</div>
		</>
	);
};

export default RetirementVariations;
