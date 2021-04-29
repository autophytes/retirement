import React, { useEffect, useRef, useState } from 'react';

const NumberInput = ({ value, onChange, className = '', id = '' }) => {
	const inputRef = useRef(null);
	const formattedValueRef = useRef('');

	const [formattedValue, setFormattedValue] = useState('');
	useEffect(() => {
		formattedValueRef.current = formattedValue;
	}, [formattedValue]);

	useEffect(() => {
		if (!inputRef.current) {
			setFormattedValue(value);
			return;
		}

		const prevFormattedValue = formattedValueRef.current;

		console.log('value:', value);

		// Reformatting when focused only happens after an action that collapses the selection
		const selection = inputRef.current.selectionStart;
		console.log('format value initial selection:', selection);

		// Save how many integers come before the selection before formatting
		let numsBefore = 0;
		for (let i = 0; i < selection; i++) {
			// Count numeric characters
			if (!isNaN(prevFormattedValue.charAt(i))) {
				console.log('is number: ', prevFormattedValue.charAt(i));
				numsBefore++;
			}
		}
		console.log('numsBefore:', numsBefore);

		// Format to thousands
		let newValue = value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

		// Calculate updated selection (accounting for inserted non-numeric characters)
		let newSelection = selection;
		let newNumsBefore = 0;
		for (let i = 0; i < newValue.length; i++) {
			// Count numeric characters
			if (!isNaN(value.charAt(i))) {
				newNumsBefore++;
			}

			// Update the cursor position once in the same spot
			if (newNumsBefore === numsBefore) {
				newSelection = i + 1;
				break;
			}
		}
		console.log('newNumsBefore:', newNumsBefore);

		setTimeout(() => {
			console.log('setting format value updated selection');
			inputRef.current.selectionStart = selection;
			inputRef.current.selectionEnd = selection;
		});

		return newValue;
	}, [value]);

	const handleOnChange = (e, value) => {
		let originalValue = e ? e.target.value : value;
		// const newValue = e.target.value;
		// const origValue =

		// Removes everything except non-numeric or decimal
		const newValue = originalValue.replace(/[^0-9.]/g, '');

		onChange(newValue);
	};

	const formatValue = (value) => {};

	const handleKeyDown = (e) => {
		// Default handling if selection is not collapsed
		if (!(e.target.selectionStart === e.target.selectionEnd)) return;

		const value = e.target.value;
		const selection = e.target.selectionStart;

		// BACKSPACING and we're at least 2 characters in, backspace the number before a comma/period
		if (
			e.key === 'Backspace' &&
			selection > 1 && // At least 2 characters in
			value.charAt(selection) !== '.' && // Allowed to backspace periods
			isNaN(value.charAt(selection - 1)) // We have a non-numeric character we need to skip
		) {
			// If the character before the cursor is non-numeric, remove the character before that
			const newValue =
				value.slice(0, selection - 2) + value.slice(selection - 1, value.length);

			// Prevent React from handling update
			e.preventDefault();
			setTimeout(() => {
				console.log('setting handleKeyDown updated selection');
				// Fix the cursor position
				e.target.selectionStart = selection - 1;
				e.target.selectionEnd = selection - 1;
			}, 0);

			// Call our onChange handler
			handleOnChange(null, newValue);

			// Exit
			return;
		}

		// DELETING and we're at least 2 characters from the end, delete the number after a space/comma
		if (
			e.key === 'Delete' &&
			selection < value.length - 1 && // At least 2 characters from the end
			value.charAt(selection) !== '.' && // Allowed to backspace periods
			isNaN(value.charAt(selection)) // We have a non-numeric character we need to skip
		) {
			// If the character after the cursor is non-numeric, remove the character after that
			const newValue = value.slice(0, selection) + value.slice(selection + 1, value.length);

			// Prevent React from handling update
			e.preventDefault();
			setTimeout(() => {
				console.log('setting handleKeyDown updated selection');
				// Fix the cursor position after everything else has updated
				e.target.selectionStart = selection;
				e.target.selectionEnd = selection;
			}, 0);

			// Call our onChange handler
			handleOnChange(null, newValue);

			// Exit
			return;
		}
	};

	return (
		<input
			type='text'
			id={id}
			ref={inputRef}
			// onKeyDown={(e) => console.log(e)}
			className={'number-input ' + className}
			value={formatValue(value)}
			onKeyDown={handleKeyDown}
			onChange={handleOnChange}
		/>
	);
};

export default NumberInput;
