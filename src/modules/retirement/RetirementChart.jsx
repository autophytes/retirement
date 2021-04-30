import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import ChartJS from 'chart.js/auto';

// Some helpful utils for chart-js
// https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js
// https://www.chartjs.org/docs/master/samples/bar/vertical.html

const options = {
	responsive: true,
	plugins: {
		filler: {
			propagate: false,
		},
		title: {
			display: true,
			text: (ctx) => 'Fill: ' + ctx.chart.data.datasets[0].fill,
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
		},
	},
};

// For initialization of the ChartJS object
let chart;

const RetirementChart = ({ results }) => {
	// REF
	const chartRef = useRef(null);

	// Update the chart with data changes
	useEffect(() => {
		if (chart) {
			console.log('rerunning chart update');

			const labels = results.map((item) => item.primary.age);
			const data = results.map((item) => item.value);

			chart.data.labels = labels;
			chart.data.datasets[0].data = data;
			chart.update();
		}
	}, [results]);

	// Initial config build
	const config = useMemo(() => {
		const newLabels = results.map((item) => item.primary.age);
		const newData = results.map((item) => item.value);

		return {
			type: 'line',
			options: options,
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

		// eslint-disable-next-line no-console
	}, []);

	// Initialize the chart
	useLayoutEffect(() => {
		if (chartRef.current) {
			chart = new ChartJS(chartRef.current, config);
		} else {
			console.log('chartRef not defined yet');
		}
	}, [config]);

	return <canvas ref={chartRef}></canvas>;
};

export default RetirementChart;
