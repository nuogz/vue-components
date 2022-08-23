const plugin = require('tailwindcss/plugin');



module.exports = {
	content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			boxShadow: {
				mdd: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
			},
		},
		trans: {
			DEFAULT: '0.2s',
			'04': '0.4s',
			'07': '0.7s',
			2: '2s',
		},
	},
	plugins: [
		plugin(({ addUtilities, matchUtilities, theme }) => {
			addUtilities({
				// inblock = inline-block + align-top
				'.inblock': {
					display: 'inline-block',
					verticalAlign: 'top'
				},
				// text ellipsis
				'.elli': {
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis'
				},
			});

			// transition delay
			matchUtilities(
				{
					trans: duration => ({
						transitionProperty: 'all',
						transitionDuration: duration,
						transform: 'translateZ(0)',
					}),
				},
				{ values: theme('trans') }
			);
		}),
	],
};
