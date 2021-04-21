import logo from './logo.svg';
// import './App.css';
// import './index.css';

import Retirement from './modules/Retirement';
import React, { useState } from 'react';
import Setup from './modules/Setup';

const App = () => {
	const [clientName, setClientName] = useState('Otto & Manua Phytes');
	const [currentTab, setCurrentTab] = useState('Retirement');

	return (
		<div style={{ margin: '3rem 5rem' }}>
			<h2 className='client-name'>{clientName}</h2>

			{/* Module Selection Tabs */}
			<nav className='navbar'>
				<button
					className={'nav-tab' + (currentTab === 'Setup' ? ' active' : '')}
					onClick={() => setCurrentTab('Setup')}>
					Setup
				</button>
				<button
					className={'nav-tab' + (currentTab === 'Retirement' ? ' active' : '')}
					onClick={() => setCurrentTab('Retirement')}>
					Retirement
				</button>
				<button
					className={'nav-tab' + (currentTab === 'College' ? ' active' : '')}
					onClick={() => setCurrentTab('College')}>
					College
				</button>
				<button
					className={'nav-tab' + (currentTab === 'Debt' ? ' active' : '')}
					onClick={() => setCurrentTab('Debt')}>
					Debt Payoff
				</button>
				<button
					className={'nav-tab' + (currentTab === 'SocialSecurity' ? ' active' : '')}
					onClick={() => setCurrentTab('SocialSecurity')}>
					Social Security
				</button>
			</nav>

			{currentTab === 'Setup' && <Setup />}
			{currentTab === 'Retirement' && <Retirement />}
			{/* {(currentTab === 'College') && <Mockup />} */}
			{/* {(currentTab === 'Debt') && <Mockup />} */}
			{/* {(currentTab === 'SocialSecurity') && <Mockup />} */}
		</div>
	);
};

export default App;
