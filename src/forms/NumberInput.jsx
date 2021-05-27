import React, { useEffect, useRef, useState } from 'react';

import numeral from 'numeral';

const NumberInput = ({
	onChange: parentOnChange,
	className = '',
	id = null,
	value,
	decimalPlaces, // Positive/Negative rounds to Right/Left of decimal
	isPercent = false,
	isCurrency = false,
	width = null,
	max,
	min,
	...additionalProps
}) => {
	// STATE
	const [displayValue, setDisplayValue] = useState(
		formatNumber({
			value,
			decimalPlaces,
			isPercent,
			max,
			min,
		})
	);

	// REF
	const inputRef = useRef(null);

	// When the parent provides a new value, format and render that
	useEffect(() => {
		setDisplayValue(
			formatNumber({
				value,
				decimalPlaces,
				isPercent,
				max,
				min,
			})
		);
	}, [value, decimalPlaces, isPercent, max, min]);

	// On blur, format the new value and pass the raw value to the parent
	const handleBlur = (e) => {
		const cleanValue = Number(e.target.value.toString().replace(/[^0-9.]/g, ''));
		// Return a decimal for percentages.
		const newValue = isPercent
			? numeral(cleanValue).divide(100).value() // Without numeral, JS has float errors
			: cleanValue;

		// Call the parent onChange handler.
		parentOnChange(newValue);

		// If the underlying value didn't change, format won't happen automatically
		if (newValue === value) {
			setDisplayValue(
				formatNumber({
					value: newValue,
					decimalPlaces,
					isPercent,
					max,
					min,
				})
			);
		}
	};

	return (
		<div className={'number-input ' + className}>
			{/* "$" PREFIX */}
			{!!isCurrency && (
				<span onClick={() => inputRef.current.select()}>
					<input
						className={'currency-symbol' + (additionalProps.disabled ? ' disabled' : '')}
						value={'$'}
						disabled
					/>
				</span>
			)}

			{/* INPUT */}
			<input
				{...additionalProps}
				type='text'
				id={id}
				ref={inputRef}
				value={displayValue}
				style={{ width: width, minWidth: width }}
				onChange={(e) => setDisplayValue(e.target.value)}
				onBlur={handleBlur}
				onFocus={(e) => e.target.select()}
				onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
			/>
		</div>
	);
};

export default NumberInput;

const formatNumber = ({ value, decimalPlaces, isPercent, max, min }) => {
	// Apply any maxes/mins
	const cappedValue = max
		? Math.min(value, isPercent ? numeral(max).divide(100).value() : max)
		: value;
	const flooredValue = min
		? Math.max(cappedValue, isPercent ? numeral(min).divide(100).value() : min)
		: cappedValue;

	// Removes non-numeric (or decimal) characters from the number
	const cleanedValue = flooredValue.toString().replace(/[^0-9.]/g, '');

	// Find the length of the whole numbers. Ex. countDigits(123.45) = 3
	const numDigits = countDigits(Number(cleanedValue));

	// Use the input to determine number of digits
	const noRounding = decimalPlaces === undefined;

	// Calculate the rounding
	const maxSigDigits =
		decimalPlaces < 0 ? Math.max(numDigits + decimalPlaces + 2, 1) : undefined;
	const minFracDigits = decimalPlaces >= 0 ? decimalPlaces : undefined;
	const maxFracDigits = decimalPlaces >= 0 ? decimalPlaces : undefined;

	const options = {
		maximumSignificantDigits: noRounding ? undefined : maxSigDigits,
		minimumFractionDigits: noRounding ? 0 : minFracDigits,
		maximumFractionDigits: noRounding ? 20 : maxFracDigits,
		style: isPercent ? 'percent' : 'decimal',
	};

	return new Intl.NumberFormat('en-US', options).format(cleanedValue);
};

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

// const countDecimals = (value) => {
// 	const numString = typeof value === 'string' ? value : value.toString();

// 	const decIndex = numString.lastIndexOf('.');
// 	if (decIndex === -1) {
// 		return 0;
// 	} else {
// 		return numString.length - decIndex - 1;
// 	}
// };
