import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load login
const LogIn = lazy(() => import("./components/LogIn"));

// Import new admin components
import { AdminManagement } from "./Components/AdminManagement";
import { AdminMembers } from "./Components/AdminMembers";
import { AdminEvents } from "./Components/AdminEvents";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/admin-management" element={<AdminManagement />} />
        <Route path="/admin-members" element={<AdminMembers />} />
        <Route path="/admin-events" element={<AdminEvents />} />
      </Routes>
    </Suspense>
  );
}

export default App;
