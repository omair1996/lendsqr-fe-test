import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/LogIn';
import Dashboard from './pages/Dashboard/Dashboard';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <MainLayout>
              <h1>Users Page</h1>
            </MainLayout>
          }
        />
        <Route
          path="/dashboard/guarantors"
          element={
            <MainLayout>
              <h1>Guarantors Page</h1>
            </MainLayout>
          }
        />
        {/* Add more routes as needed */}
        <Route path="/dashboard/*" element={<Navigate to="/dashboard/users" />} />
      </Routes>
    </Router>
  );
}

export default App;
