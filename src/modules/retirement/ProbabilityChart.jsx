import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import ChartJS from 'chart.js/auto';

import { PROBABILITY_OPTIONS } from './chartOptions';

// Some helpful utils for chart-js
// https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js
// https://www.chartjs.org/docs/master/samples/bar/vertical.html

let width, height, gradientFill, gradientBorder;

// For initialization of the ChartJS object

const ProbabilityChart = ({ results, bands, chartLeft }) => {
	// STATE
	const [localChartLeft, setLocalChartLeft] = useState(0);

	// REF
	const chartCanvasRef = useRef(null);
	const chartRef = useRef(null);

	// Update the chart with data changes
	useEffect(() => {
		if (chartRef.current) {
			// test
			console.log('rerunning chartRef.current update');

			const labels = results.map((item) => item.primary.age);
			// const data = results.map((item) => item.value);

			chartRef.current.data.labels = labels;
			chartRef.current.data.datasets[0].data = [];

			// Std dev bands
			if (bands.length) {
				const probBand = bands.map((item) => item[2]);

				chartRef.current.data.datasets[0].data = probBand;
			} else {
				chartRef.current.data.datasets[0].data = [];
			}

			chartRef.current.update();
		}
	}, [results, bands]);

	// Initial config build
	const config = useMemo(() => {
		const newLabels = results.map((item) => item.primary.age);
		// const straightLineData = results.map((item) => item.value);

		return {
			type: 'line',
			options: PROBABILITY_OPTIONS,
			data: {
				labels: newLabels,
				datasets: [
					{
						// label: 'Value',
						data: [],
						// borderColor: 'rgba(74, 201, 117)',
						// Sets the background color to a gradient
						backgroundColor: (context) => {
							const { ctx, chartArea } = context.chart;

							// Wait until after initial chart load
							if (!chartArea) return null;

							setLocalChartLeft((prev) => (!prev ? chartArea.left : prev));

							// Generates the gradient
							return getGradientFill(ctx, chartArea);
						},
						borderColor: (context) => {
							const { ctx, chartArea } = context.chart;

							// Wait until after initial chart load
							if (!chartArea) return null;

							// Generates the gradient
							return getGradientBorder(ctx, chartArea);
						},
						fill: 'start',
					},
				],
			},
		};

		// eslint-disable-next-line
	}, []);

	// Initialize the chart
	useLayoutEffect(() => {
		if (chartCanvasRef.current) {
			chartRef.current = new ChartJS(chartCanvasRef.current, config);
		} else {
			console.log('chartCanvasRef not defined yet');
		}
	}, [config]);

	return (
		<div className='probability-chart-wrapper'>
			<canvas
				ref={chartCanvasRef}
				style={{ paddingLeft: chartLeft - localChartLeft + 2 }}></canvas>
		</div>
	);
};

export default ProbabilityChart;

// Creates the gradient fill
const getGradientFill = (ctx, chartArea) => {
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (gradientFill === undefined || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradientFill = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
		gradientFill.addColorStop(0, 'rgba(74, 201, 117, 0)');
		gradientFill.addColorStop(0.3, 'rgba(74, 201, 117, 0.2)');
		gradientFill.addColorStop(1, 'rgba(74, 201, 117, 0.2)');
	}

	return gradientFill;
};

// Creates the gradient fill
const getGradientBorder = (ctx, chartArea) => {
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;

	if (gradientBorder === undefined || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradientBorder = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
		gradientBorder.addColorStop(0, 'rgb(255, 116, 115)');
		gradientBorder.addColorStop(0.3, 'rgb(255, 116, 115)');
		gradientBorder.addColorStop(1, 'rgb(74, 201, 117)');
	}

	return gradientBorder;
};

// rgba(	255, 116, 115)
