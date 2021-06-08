import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import ChartJS from 'chart.js/auto';

import { RETIREMENT_OPTIONS } from './chartOptions';

// Some helpful utils for chart-js
// https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js
// https://www.chartjs.org/docs/master/samples/bar/vertical.html

let width, height, gradient;

// For initialization of the ChartJS object

const RetirementChart = ({ results, bands, setChartLeft }) => {
	// REF
	const chartCanvasRef = useRef(null);
	const chartRef = useRef(null);

	// Update the chart with data changes
	useEffect(() => {
		if (chartRef.current) {
			// test
			console.log('rerunning chartRef.current update');

			const labels = results.map((item) => item.primary.age);
			const data = results.map((item) => item.value);

			chartRef.current.data.labels = labels;
			chartRef.current.data.datasets[2].data = data;

			// Std dev bands
			if (bands.length) {
				const upperBand = bands.map((item) => item[0]);
				const lowerBand = bands.map((item) => item[1]);
				const probBand = bands.map((item) => item[2]);

				chartRef.current.data.datasets[0].data = upperBand;
				chartRef.current.data.datasets[1].data = lowerBand;
			} else {
				chartRef.current.data.datasets[0].data = [];
				chartRef.current.data.datasets[1].data = [];
			}

			chartRef.current.update();
		}
	}, [results, bands]);

	// Initial config build
	const config = useMemo(() => {
		const newLabels = results.map((item) => item.primary.age);
		const straightLineData = results.map((item) => item.value);

		return {
			type: 'line',
			options: RETIREMENT_OPTIONS,
			data: {
				labels: newLabels,
				datasets: [
					{
						// label: 'Value',
						data: [],
						borderColor: 'rgba(	255, 116, 115)',
					},
					{
						// label: 'Value',
						data: [],
						borderColor: 'rgba(	71, 184, 224)',
					},
					{
						// label: 'Value',
						data: straightLineData,
						borderColor: 'rgba(74, 201, 117)',
						// Sets the background color to a gradient
						backgroundColor: (context) => {
							const { ctx, chartArea } = context.chart;

							// Wait until after initial chart load
							if (!chartArea) {
								return null;
							}

							setChartLeft(chartArea.left);

							// Generates the gradient
							return getGradient(ctx, chartArea);
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
		<div
			style={{
				position: 'relative',
				// width: 'calc(100% - 1.75rem)',
				margin: '0 auto',
			}}>
			<canvas ref={chartCanvasRef}></canvas>
		</div>
	);
};

export default RetirementChart;

// Creates the gradient fill
const getGradient = (ctx, chartArea) => {
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (gradient === null || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
		gradient.addColorStop(0, 'rgba(74, 201, 117, 0)');
		gradient.addColorStop(0.3, 'rgba(74, 201, 117, 0.2)');
		gradient.addColorStop(1, 'rgba(74, 201, 117, 0.2)');
	}

	return gradient;
};
