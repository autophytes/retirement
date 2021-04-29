import "./styles/index.css";
import "./App.scss";

import FinancialPlanning from "./FinancialPlanning";
import AppContextProvider from "./context/appContext";

function App() {
  return (
    <AppContextProvider>
      <FinancialPlanning />
    </AppContextProvider>
  );
}

export default App;
