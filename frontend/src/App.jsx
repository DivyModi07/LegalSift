import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import IPCExplorer from './pages/IPCExplorer';
import Chatbot from './pages/Chatbot';
import AdminComplaints from './pages/AdminComplaints';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminLawyers from './pages/AdminLawyers';
import LawyerApplication from './pages/LawyerApplication';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Home Route Component with Auto-Redirect
const HomeRoute = () => {
  const { isAuthenticated, userRole } = useAuthStore();
  
  if (isAuthenticated) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/complaints" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <LandingPage />;
};

function App() {
  const { isAuthenticated, userRole, checkAuth } = useAuthStore();
  
  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/ipc-explorer" element={<IPCExplorer />} />
            <Route path="/lawyer-application" element={<LawyerApplication />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-complaint" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <SubmitComplaint />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Chatbot />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/complaints" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/lawyers" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLawyers />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
