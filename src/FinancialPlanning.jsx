import Retirement from './modules/retirement/Retirement';
import React, { useState } from 'react';
import Setup from './modules/Setup';

const App = () => {
	const [currentTab, setCurrentTab] = useState('Setup');

	const [clientName, setClientName] = useState('Jim & Janice Barnes');
	const [editingName, setEditingName] = useState(false);

	// const handleTitleClick = () => {

	// }

	return (
		<div className='page-container'>
			{/* CONTACT NAME */}
			{editingName ? (
				<input
					type='text'
					className='client-name-title-input'
					autoFocus
					value={clientName}
					size={clientName.length}
					onFocus={(e) => e.target.select()}
					onChange={(e) => setClientName(e.target.value)}
					onBlur={(e) => {
						setClientName(e.target.value || 'Sample Plan');
						setEditingName(false);
					}}
				/>
			) : (
				<h2 className='client-name-title' onClick={() => setEditingName(true)}>
					{clientName}
				</h2>
			)}

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
