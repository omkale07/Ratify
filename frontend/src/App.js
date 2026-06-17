import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages (we'll create these next)
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStores from './pages/admin/Stores';
import UserStores from './pages/user/Stores';
import StoreOwnerDashboard from './pages/storeOwner/Dashboard';

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute role="admin"><AdminStores /></ProtectedRoute>
          } />

          {/* Normal User */}
          <Route path="/stores" element={
            <ProtectedRoute role="user"><UserStores /></ProtectedRoute>
          } />

          {/* Store Owner */}
          <Route path="/store-owner/dashboard" element={
            <ProtectedRoute role="store_owner"><StoreOwnerDashboard /></ProtectedRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;