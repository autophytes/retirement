import './styles/index.css';

import FinancialPlanning from './FinancialPlanning';
import AppContextProvider from './context/appContext';

function App() {
	return (
		<AppContextProvider>
			<FinancialPlanning />
		</AppContextProvider>
	);
}

export default App;
