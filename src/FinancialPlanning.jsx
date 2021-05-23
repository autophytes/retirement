import Retirement from './modules/retirement/Retirement';
import React, { useState } from 'react';
import Setup from './modules/Setup';

const TABS = ['Setup', 'Retirement', 'College', 'Debt Payoff', 'Social Security'];

const App = () => {
	const [currentTab, setCurrentTab] = useState('Setup');

	const [clientName, setClientName] = useState('Auto & Manual Phytes');

	return (
		<>
			{/* Shadow */}
			<div className='page-shadow' />

			{/* Module Selection Tabs */}
			<nav className='navbar-wrapper'>
				<nav className='navbar'>
					{TABS.map((tab) => (
						<div
							key={tab}
							className={'nav-tab-wrapper' + (currentTab === tab ? ' active' : '')}>
							<button
								key={tab}
								className={'nav-tab' + (currentTab === tab ? ' active' : '')}
								onClick={() => setCurrentTab(tab)}>
								{tab}
							</button>
						</div>
					))}
				</nav>
			</nav>

			<div className='page-container'>
				{currentTab === 'Setup' && (
					<Setup clientName={clientName} setClientName={setClientName} />
				)}
				{currentTab === 'Retirement' && <Retirement clientName={clientName} />}
				{/* {(currentTab === 'College') && <Mockup />} */}
				{/* {(currentTab === 'Debt') && <Mockup />} */}
				{/* {(currentTab === 'SocialSecurity') && <Mockup />} */}

				<p style={{ color: '#555' }}>
					Disclaimer: this is a work in progress, is likely full of errors right now, and
					shouldn't be taken as financial advice. Gotta love the finance industry.
				</p>
			</div>
		</>
	);
};

export default App;
