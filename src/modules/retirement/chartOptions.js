import { formatNumber } from '../../utils/utils';

export const RETIREMENT_OPTIONS = {
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
		tooltip: {
			borderColor: 'rgba(0, 149, 255, 1)',
			borderWidth: 2,
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
			// yAlign: 'bottom',
			titleAlign: 'center',
			titleFont: {
				size: 18,
				weight: 'bold',
			},
			titleColor: 'rgba(0, 0, 0, 1)',
			bodyFont: {
				size: 16,
			},
			bodyAlign: 'center',
			bodyColor: 'rgba(0, 0, 0, 1)', // Value: 234,234.23
			displayColors: false, //
			callbacks: {
				title: (tooltipArray) => 'Age ' + tooltipArray[0].label,
				label: (context) => {
					return (
						'$' +
						formatNumber({
							value: context.raw,
							decimalPlaces: -5,
						})
					);
				},
			},
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

export const PROBABILITY_OPTIONS = {
	responsive: true,
	aspectRatio: 12,
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
		tooltip: {
			borderColor: 'rgba(0, 149, 255, 1)',
			borderWidth: 2,
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
			padding: {
				top: 6,
				bottom: 6,
				left: 8,
				right: 8,
			},
			bodyFont: {
				size: 18,
				weight: 'bold',
			},
			bodyColor: 'rgba(0, 0, 0, 1)', // Value: 234,234.23
			bodyAlign: 'center',
			displayColors: false, //
			callbacks: {
				title: (tooltipArray) => null,
				label: (context) => {
					return formatNumber({
						value: context.raw,
						decimalPlaces: 1,
						isPercent: true,
					});
				},
			},
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
				display: false,
			},
			display: false,
		},
		x: {
			ticks: {
				font: {
					size: 18,
				},
				color: 'rgba(0, 0, 0, 0)', // Label color
				// display: false,
			},
		},
	},
};
