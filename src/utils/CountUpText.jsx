import React, { useEffect } from 'react';

import { useCountUp } from 'react-countup';

const countUpOptions = {
	end: 0,
	duration: 0.5,
	prefix: '',
	suffix: '',
	separator: ',',
	decimals: 0,
	delay: 0,
	preserveValue: true,
};

// Animated values availabe now. Value should be in thousands of dollars (10,000 => 10)
const CountUpText = ({ value, suffix = ',000', prefix = '$' }) => {
	const { countUp, update } = useCountUp(countUpOptions);

	useEffect(() => {
		update(value);
	}, [value, update]);

	return <span>{prefix + countUp + (countUp !== '0' ? suffix : '')}</span>;
};

export default CountUpText;
