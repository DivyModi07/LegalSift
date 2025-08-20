import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, Scale, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-medium rounded-lg ${
        isActive(to)
          ? 'text-yellow-600 bg-yellow-50'
          : 'text-stone-700 hover:text-yellow-600 hover:bg-stone-50'
      }`}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      className={`block px-4 py-3 text-base font-medium rounded-lg ${
        isActive(to)
          ? 'text-yellow-600 bg-yellow-50'
          : 'text-stone-700 hover:text-yellow-600 hover:bg-stone-50'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xl font-bold text-stone-800">LegalSift</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
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
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-stone-700 hover:text-yellow-600 font-medium px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-stone-700 hover:text-yellow-600 font-medium px-4 py-2 rounded-lg hover:bg-stone-50"
                >
                  <div className="bg-yellow-100 p-1.5 rounded-lg">
                    <User className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span>{user?.first_name || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 z-20">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-sm font-medium text-stone-900">{user?.first_name} {user?.last_name}</p>
                          <p className="text-xs text-stone-500">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3 text-yellow-600" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4 mr-3 text-yellow-600" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-stone-700 hover:bg-red-50 hover:text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-3 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-700 hover:text-yellow-600 p-2 rounded-lg hover:bg-stone-50"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/submit-complaint" onClick={() => setIsMobileMenuOpen(false)}>
                  Submit Complaint
                </MobileNavLink>
                <MobileNavLink to="/ipc-explorer" onClick={() => setIsMobileMenuOpen(false)}>
                  IPC Explorer
                </MobileNavLink>
                <MobileNavLink to="/chatbot" onClick={() => setIsMobileMenuOpen(false)}>
                  Legal Assistant
                </MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/ipc-explorer" onClick={() => setIsMobileMenuOpen(false)}>
                  IPC Explorer
                </MobileNavLink>
              </>
            )}

            {!isAuthenticated ? (
              <div className="pt-4 space-y-2 border-t border-stone-200">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-base font-medium text-stone-700 hover:text-yellow-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-3 rounded-lg text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-4 space-y-2 border-t border-stone-200">
                {user && (
                  <div className="px-4 py-2 bg-stone-50 rounded-lg mb-2">
                    <p className="font-medium text-stone-900">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-stone-600">{user.email}</p>
                  </div>
                )}
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-base font-medium text-stone-700 hover:text-yellow-600 hover:bg-stone-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-yellow-600" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-base font-medium text-stone-700 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-3 text-red-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;