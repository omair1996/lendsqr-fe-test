import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/LogIn';
import MainLayout from './layouts/MainLayout';
import User from './pages/Dashboard/Users/User';
import UserDetailsPage from './pages/Dashboard/userDetails/UserDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/user"
          element={
            <MainLayout>
              <User />
            </MainLayout>
          }
        />

        <Route
          path="/dashboard/user/:id"
          element={
            <MainLayout>
              <UserDetailsPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
