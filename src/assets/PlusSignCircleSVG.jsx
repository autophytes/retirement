import React from 'react';

const PlusSignCircleSVG = ({ style: circleStyle = {} }) => {
	return (
		<svg viewBox='0 0 512 512' style={{ enableBackground: 'new 0 0 512 512' }}>
			<circle
				r='256'
				cx='256'
				cy='256'
				shape='circle'
				transform='matrix(1,0,0,1,0,0)'
				style={{ ...circleStyle }}
			/>
			<g transform='matrix(0.56,0,0,0.56,112.64,112.64)'>
				<path
					d='m467 211h-166v-166c0-24.853-20.147-45-45-45s-45 20.147-45 45v166h-166c-24.853 0-45 20.147-45 45s20.147 45 45 45h166v166c0 24.853 20.147 45 45 45s45-20.147 45-45v-166h166c24.853 0 45-20.147 45-45s-20.147-45-45-45z'
					fill='#ffffff'
				/>
			</g>
		</svg>
	);
};

export default PlusSignCircleSVG;
