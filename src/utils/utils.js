import numeral from 'numeral';

export const formatNumber = ({ value, decimalPlaces, isPercent, max, min }) => {
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
export const countDigits = (number, count = 0) => {
	// If we haven't rounded down to zero yet, keep incrementing
	if (number) {
		return countDigits(Math.floor(number / 10), ++count);
	} else {
		// Return the final digit count
		return count;
	}
};

export const roundTo = (numberToRound, precision) => {
	return Number(Math.round(numberToRound + `e${precision}`) + `e${-precision}`);
};
