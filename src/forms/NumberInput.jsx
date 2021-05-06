import React, { useEffect, useRef, useState } from 'react';

const NumberInput = ({ value, onChange, className = '', id = '', ...additionalProps }) => {
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

		const newValue = part1 + (part2 ? '.' + part2 : '');
		console.log('newValue:', newValue);

		// Always format to the penny for currencies
		// If the period is the last digit, don't truncate
		// non-collapsed backspace/delete is deleting extra character
		// Prefix with a $ for currencies
		// Add percentage support as well
		// NOTE TO SELF - useLayoutEffect queued update for selection

		let newTimeout;
		if (digitsBeforeSelectionRef.current !== null) {
			let newCursor = findCursorPositionForDigits(newValue, digitsBeforeSelectionRef.current);

			newTimeout = setTimeout(() => {
				console.log('setting format value updated selection');
				inputRef.current.selectionStart = newCursor;
				inputRef.current.selectionEnd = newCursor;
			});
		}

		setFormattedValue(newValue);

		// If rerunning before the timeout executes, clear the old timeout
		return () => clearTimeout(newTimeout);
	}, [value]);

	// TODO
	// Have a variable that we store the new cursor position in (digitsBefore variable)
	// At the end, if that variable is non-null, fire the change handler
	// And then store the new digit counter

	// Then, our useEffect that formats the value needs to update cursor position
	//   based off of the digitsBefore ref

	// Add support for $ in the formatting. Also add % handling. More complex.

	const handleKeyDown = (e) => {
		let numberValue = value.toString();
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
		} else if (e.key === '.') {
			// PERIOD
			// If we don't already have a period, insert a period
			if (numberValue.indexOf('.') === -1) {
				numberValue =
					numberValue.slice(0, selectionStart) +
					e.key +
					numberValue.slice(selectionEnd, numberValue.length);

				newCursor = selectionStart + 1;
			}
		} else if (/\d/.test(e.key.charAt(0))) {
			// DIGIT
			// Insert the digit at that point
			numberValue =
				numberValue.slice(0, selectionStart) +
				e.key +
				numberValue.slice(selectionEnd, numberValue.length);

			newCursor = selectionStart + 1;
		}

		if (newCursor !== undefined) {
			digitsBeforeSelectionRef.current = newCursor;
			onChange(Number(numberValue));
		}
	};

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
