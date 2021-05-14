import Retirement from './modules/retirement/Retirement';
import React, { useState } from 'react';
import Setup from './modules/Setup';

const TABS = ['Setup', 'Retirement', 'College', 'Debt Payoff', 'Social Security'];

const App = () => {
	const [currentTab, setCurrentTab] = useState('Setup');

	const [clientName, setClientName] = useState('Jim & Janice Barnes');
	const [editingName, setEditingName] = useState(false);

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
				{TABS.map((tab) => (
					<button
						key={tab}
						className={'nav-tab' + (currentTab === tab ? ' active' : '')}
						onClick={() => setCurrentTab(tab)}>
						{tab}
					</button>
				))}
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
