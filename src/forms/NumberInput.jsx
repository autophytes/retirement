import React, { useEffect, useRef, useState } from 'react';

import numeral from 'numeral';
import { formatNumber } from '../utils/utils';

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

// const countDecimals = (value) => {
// 	const numString = typeof value === 'string' ? value : value.toString();

// 	const decIndex = numString.lastIndexOf('.');
// 	if (decIndex === -1) {
// 		return 0;
// 	} else {
// 		return numString.length - decIndex - 1;
// 	}
// };
