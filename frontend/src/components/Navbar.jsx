import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, Scale, FileText, BarChart3, Users } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, userRole, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-soft border-b border-neutral-200">
      <div className="container-max">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-neutral-900">LegalSift</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated || userRole !== 'admin' ? (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-primary-500' 
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  Home
                </Link>
                
                <Link
                  to="/ipc-explorer"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/ipc-explorer') 
                      ? 'text-primary-500' 
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  IPC Explorer
                </Link>
              </>
            ) : null}

            {isAuthenticated && userRole === 'user' && (
              <>
                <Link
                  to="/submit-complaint"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/submit-complaint') 
                      ? 'text-primary-500' 
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  Submit Complaint
                </Link>
                <Link
                  to="/chatbot"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/chatbot') 
                      ? 'text-primary-500' 
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  Legal Assistant
                </Link>
              </>
            )}

            {isAuthenticated && userRole === 'admin' && (
              <>
                <Link
                  to="/admin/complaints"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin/complaints') 
                      ? 'text-primary-500' 
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  Recent Complaints
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin/analytics') 
                      ? 'text-primary-500' 
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  Analytics
                </Link>
                <Link
                  to="/admin/lawyers"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin/lawyers') 
                      ? 'text-primary-500' 
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  Lawyer Management
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user?.name || 'User'}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    {userRole === 'user' && (
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-600 hover:text-primary-500 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="space-y-2">
              {!isAuthenticated || userRole !== 'admin' ? (
                <>
                  <Link
                    to="/"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  <Link
                    to="/ipc-explorer"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/ipc-explorer') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    IPC Explorer
                  </Link>
                </>
              ) : null}

              {isAuthenticated && userRole === 'user' && (
                <>
                  <Link
                    to="/submit-complaint"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/submit-complaint') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Submit Complaint
                  </Link>
                  <Link
                    to="/chatbot"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/chatbot') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Legal Assistant
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/dashboard') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {isAuthenticated && userRole === 'admin' && (
                <>
                  <Link
                    to="/admin/complaints"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/admin/complaints') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Recent Complaints
                  </Link>
                  <Link
                    to="/admin/analytics"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/admin/analytics') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/admin/lawyers"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/admin/lawyers') 
                        ? 'text-primary-500 bg-primary-50' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Lawyer Management
                  </Link>
                </>
              )}

              {!isAuthenticated ? (
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block mx-3 btn btn-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-neutral-200">
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
