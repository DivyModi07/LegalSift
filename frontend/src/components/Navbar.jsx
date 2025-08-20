import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, Scale } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive(to)
          ? 'text-primary-500'
          : 'text-neutral-600 hover:text-primary-500'
      }`}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive(to)
          ? 'text-primary-500 bg-primary-50'
          : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

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
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/submit-complaint">Submit Complaint</NavLink>
                <NavLink to="/ipc-explorer">IPC Explorer</NavLink>
                <NavLink to="/chatbot">Legal Assistant</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/ipc-explorer">IPC Explorer</NavLink>
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
                  <span>{user?.first_name || 'User'}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
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
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
                  <MobileNavLink to="/submit-complaint">Submit Complaint</MobileNavLink>
                  <MobileNavLink to="/ipc-explorer">IPC Explorer</MobileNavLink>
                  <MobileNavLink to="/chatbot">Legal Assistant</MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink to="/">Home</MobileNavLink>
                  <MobileNavLink to="/ipc-explorer">IPC Explorer</MobileNavLink>
                </>
              )}

              {!isAuthenticated ? (
                <div className="pt-4 space-y-2">
                  <MobileNavLink to="/login">Login</MobileNavLink>
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
