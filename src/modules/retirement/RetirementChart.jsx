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

const RetirementChart = ({ results }) => {
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
			chartRef.current.update();
		}
	}, [results]);

	// Initial config build
	const config = useMemo(() => {
		const newLabels = results.map((item) => item.primary.age);
		const newData = results.map((item) => item.value);

		return {
			type: 'line',
			options: OPTIONS,
			data: {
				labels: newLabels,
				datasets: [
					{
						label: 'Dataset',
						data: newData,
						borderColor: 'rgba(255, 99, 132)',
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
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

	return <canvas ref={chartCanvasRef}></canvas>;
};

export default RetirementChart;
