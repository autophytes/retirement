import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import ChartJS from 'chart.js/auto';

// Some helpful utils for chart-js
// https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js
// https://www.chartjs.org/docs/master/samples/bar/vertical.html

const OPTIONS = {
	responsive: true,
	plugins: {
		filler: {
			propagate: false,
		},
		title: {
			display: false,
			// text: (ctx) => 'Fill: ' + ctx.chart.data.datasets[0].fill,
		},
		legend: {
			display: false,
		},
	},
	interaction: {
		intersect: false,
	},
	elements: {
		line: {
			tension: 0.4,
		},
	},
	scales: {
		y: {
			min: 0,
			ticks: {
				font: {
					size: 18,
				},
				callback: (value, index, values) => {
					// return '$' + value;
					return new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						maximumFractionDigits: 0,
						minimumFractionDigits: 0,
					}).format(value);
				},
			},
		},
		x: {
			ticks: {
				font: {
					size: 18,
				},
			},
		},
	},
};

// For initialization of the ChartJS object

const RetirementChart = ({ results, bands }) => {
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
			chartRef.current.data.datasets[0].data = data;

			// Std dev bands
			if (bands.length) {
				const upperBand = bands.map((item) => item[0]);
				const lowerBand = bands.map((item) => item[1]);

				chartRef.current.data.datasets[1].data = upperBand;
				chartRef.current.data.datasets[2].data = lowerBand;
			} else {
				chartRef.current.data.datasets[1].data = [];
				chartRef.current.data.datasets[2].data = [];
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
			options: OPTIONS,
			data: {
				labels: newLabels,
				datasets: [
					{
						label: 'Value',
						data: straightLineData,
						borderColor: 'rgba(255, 99, 132)',
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						fill: 'start',
					},
					{
						label: 'Value',
						data: [],
						borderColor: 'rgba(255, 99, 132)',
					},
					{
						label: 'Value',
						data: [],
						borderColor: 'rgba(255, 99, 132)',
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
