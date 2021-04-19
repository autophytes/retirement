import React from 'react';

const Mockup = () => {
	return (
		<div style={{ margin: '3rem 5rem' }}>
			<h2 className='client-name'>Otto &amp; Manua Phytes</h2>

			{/* Module Selection Tabs */}
			<nav className='navbar'>
				<div className='nav-tab'>Setup</div>
				<div className='nav-tab active'>Retirement</div>
				<div className='nav-tab'>College</div>
				<div className='nav-tab'>Debt Payoff</div>
				<div className='nav-tab'>Social Security</div>
			</nav>

			{/* Module Contents */}
			<section className='flex-row'>
				{/* Plan Variation Toggles */}
				<div>
					<h3>Return</h3>
					<div className='variation-section'>
						<button className='variation-section-button'>6%</button>
						<button className='variation-section-button'>7%</button>
						<button className='variation-section-button'>8%</button>
					</div>

					<h3>Income</h3>
					<div>
						<button className='variation-section-button'>70,000</button>
						<button className='variation-section-button'>80,000</button>
						<button className='variation-section-button'>90,000</button>
					</div>

					<h3>Age</h3>
					<div>
						<button className='variation-section-button'>55</button>
						<button className='variation-section-button'>60</button>
						<button className='variation-section-button'>65</button>
					</div>
				</div>

				{/* Plan Results */}
				<div>
					{/* Top row of results */}
					<div className='top-row'>
						<div className='top-row-section'>
							<p>Savings At Retirement</p>
							<p>$1,000,00</p>
						</div>

						<div className='top-row-section'>
							<p>Lasts Until</p>
							<p>95</p>
						</div>

						<div className='top-row-section'>
							<p>Crypto Money?</p>
							<p>No</p>
						</div>
					</div>

					{/* Big boy graph */}
					<div style={{ width: '1000px', height: '500px', border: '1px solid gray' }}></div>

					{/* Detailed results */}
					<div></div>

					{/* Monte Carlo age probabilities */}
					<div></div>
				</div>
			</section>
		</div>
	);
};

export default Mockup;
