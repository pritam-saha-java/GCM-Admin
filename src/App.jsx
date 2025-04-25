import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy } from "react";
const LogIn = lazy(() => import("./components/LogIn"));
import { AdminDeposit } from "./Components/AdminDeposit";
import CurrencyManagement from "./Components/CurrencyManagement";
import { AdminWithdraw } from "./Components/AdminWithdraw";
import { AdminPackages } from "./Components/AdminPackages";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {

  return (
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/currency" element={<CurrencyManagement />} />
          <Route path="/admin-deposit" element={<AdminDeposit />} />
          <Route path="/admin-withdraw" element={<AdminWithdraw />} />
          <Route path="/admin-packages" element={<AdminPackages />} />
        </Routes>
  );
}

export default App;
