import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const NumberInput = ({
	value,
	onChange,
	className = '',
	id = '',
	decimalPlaces = 2,
	...additionalProps
}) => {
	const inputRef = useRef(null);
	const formattedValueRef = useRef('');

	const digitsBeforeSelectionRef = useRef(null);

	const [formattedValue, setFormattedValue] = useState('');
	useEffect(() => {
		formattedValueRef.current = formattedValue;
	}, [formattedValue]);

	// Format and render the new value
	useEffect(() => {
		if (!inputRef.current) {
			setFormattedValue(value);
			return;
		}

		// Format to thousands
		let [part1, part2] = value.toString().split('.', 2);
		part1 = part1.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		console.log('part1:', part1);

		console.log('part2:', part2);

		if (decimalPlaces > 0) {
			part2 = part2 ?? '0';
			part2 = Number.parseFloat('0.' + part2)
				.toFixed(decimalPlaces)
				.slice(1);
			console.log('part2:', part2);
		}

		const newValue = part1 + (part2 ?? '');
		console.log('newValue:', newValue);

		setFormattedValue(newValue);

		// If rerunning before the timeout executes, clear the old timeout
	}, [value, decimalPlaces]);

	// TODO
	// Refactor to onBlur-based formatting
	// Currency/percentage support. Decimal places support.
	// Maybe archive this component and copy into a new one so I can reference this if I want.

	const handleKeyDown = (e) => {
		let numberValue = Number.parseFloat(value).toFixed(decimalPlaces > 0 ? decimalPlaces : 0);
		console.log('numberValue:', numberValue);

		const textValue = e.target.value;

		// Formatted value selection
		const formattedSelectionStart = e.target.selectionStart;
		const formattedSelectionEnd = e.target.selectionEnd;
		const isCollapsed = e.target.selectionStart;

		const digitsBeforeSelection = countDigitsInString(
			textValue.slice(0, formattedSelectionStart)
		);
		const digitsInSelection = countDigitsInString(
			textValue.slice(formattedSelectionStart, formattedSelectionEnd)
		);

		// Raw value selection
		const selectionStart = digitsBeforeSelection;
		const selectionEnd = digitsBeforeSelection + digitsInSelection;

		let newCursor;

		if (e.key === 'Backspace') {
			// BACKSPACE
			if (isCollapsed) {
				// Remove the character before the selection
				numberValue =
					numberValue.slice(0, Math.max(selectionStart - 1, 0)) +
					numberValue.slice(selectionEnd, numberValue.length);

				newCursor = selectionStart - 1;
			} else {
				// Remove the selected content
				numberValue =
					numberValue.slice(0, selectionStart) +
					numberValue.slice(selectionEnd, numberValue.length);

				newCursor = selectionStart;
			}
		} else if (e.key === 'Delete') {
			// DELETE
			if (isCollapsed) {
				// Remove the character after the selection
				numberValue =
					numberValue.slice(0, selectionStart) +
					numberValue.slice(
						Math.min(selectionEnd + 1, numberValue.length),
						numberValue.length
					);

				newCursor = selectionStart;
			} else {
				// Remove the selected content
				numberValue =
					numberValue.slice(0, selectionStart) +
					numberValue.slice(selectionEnd, numberValue.length);

				newCursor = selectionStart;
			}
		}
		// else if (e.key === '.') {
		// 	// PERIOD
		// 	// If we don't already have a period, insert a period
		// 	if (numberValue.indexOf('.') === -1) {
		// 		numberValue =
		// 			numberValue.slice(0, selectionStart) +
		// 			e.key +
		// 			numberValue.slice(selectionEnd, numberValue.length);

		// 		newCursor = selectionStart + 1;
		// 	}
		// }
		else if (/\d/.test(e.key.charAt(0))) {
			// DIGIT
			// Insert the digit at that point
			numberValue =
				numberValue.slice(0, selectionStart) +
				e.key +
				numberValue.slice(selectionEnd, numberValue.length);

			// When the value is 0 and typing after the leading 0
			if (selectionStart === 1 && numberValue.charAt(0) === '0') {
				// Ensure the cursor stays before the decimal
				newCursor = 1;
			} else {
				newCursor = selectionStart + 1;
			}
		}

		if (newCursor !== undefined) {
			e.preventDefault();

			digitsBeforeSelectionRef.current = newCursor;

			onChange(Number(numberValue));
		}
	};

	// Update the cursor
	useLayoutEffect(() => {
		console.log('digitsBeforeSelectionRef.current:', digitsBeforeSelectionRef.current);
		if (digitsBeforeSelectionRef.current !== null) {
			let newCursor = findCursorPositionForDigits(
				formattedValue,
				digitsBeforeSelectionRef.current
			);

			// If the value is 0, select the entire thing
			if (Number(formattedValue) === 0) {
				inputRef.current.selectionStart = 0;
				inputRef.current.selectionEnd = 2 + Math.max(decimalPlaces, 0);

				digitsBeforeSelectionRef.current = null;
				return;
			}

			console.log('newCursor:', newCursor);

			inputRef.current.selectionStart = newCursor;
			inputRef.current.selectionEnd = newCursor;

			digitsBeforeSelectionRef.current = null;
		}
	}, [formattedValue]);

	return (
		<input
			type='text'
			id={id}
			ref={inputRef}
			onBlur={() => (digitsBeforeSelectionRef.current = null)}
			// onKeyDown={(e) => console.log(e)}
			className={'number-input ' + className}
			value={formattedValue}
			onKeyDown={handleKeyDown}
			// onChange={handleOnChange} // NOTE: re-enable for copy/paste
			{...additionalProps}
		/>
	);
};

export default NumberInput;

const countDigitsInString = (string) => {
	let digitCount = 0;
	for (let i = 0; i < string.length; i++) {
		// Count numeric characters
		if (!isNaN(string.charAt(i)) || string.charAt(i) === '.') {
			digitCount++;
		}
	}

	return digitCount;
};

const findCursorPositionForDigits = (string, digits) => {
	let digitCount = 0;

	for (let i = 0; i <= string.length; i++) {
		// Count numeric characters
		if (string.charAt(i) && (!isNaN(string.charAt(i)) || string.charAt(i) === '.')) {
			digitCount++;

			if (digitCount > digits) {
				return i;
			}
		}
	}

	return string.length;
	// return cursor;
};
