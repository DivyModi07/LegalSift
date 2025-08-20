import { Link } from 'react-router-dom';
import { Scale, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Footer = () => {
  const { isAuthenticated } = useAuthStore();

  const getQuickLinks = () => {
    if (isAuthenticated) {
      // Links for any logged-in user
      return [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/submit-complaint', label: 'Submit Complaint' },
        { to: '/ipc-explorer', label: 'IPC Explorer' },
        { to: '/chatbot', label: 'Legal Assistant' },
      ];
    }
    // Links for logged-out users
    return [
      { to: '/', label: 'Home' },
      { to: '/ipc-explorer', label: 'IPC Explorer' },
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ];
  };

  const quickLinks = getQuickLinks();

  return (
    <footer className="bg-gradient-to-r from-primary-800 to-primary-900 text-white">
      <div className="container-max py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-6 w-6 text-primary-200" />
              <span className="text-lg font-bold">LegalSift</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              Empowering citizens with AI-driven legal assistance and comprehensive IPC exploration tools.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-3">
              {quickLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="text-primary-100 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white mb-4">Contact Us</h3>
            <div className="flex flex-col space-y-3 text-sm">
                <div className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-primary-200" />
                    <span className="text-primary-100">LegalSift@gmail.com</span>
                </div>
                <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-primary-200" />
                    <span className="text-primary-100">+91 70692 35312</span>
                </div>
                <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-primary-200" />
                    <span className="text-primary-100">Ahmedabad, India</span>
                </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="md:col-span-1">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm mb-2">Important Legal Notice</h4>
                  <p className="text-primary-50 text-xs leading-relaxed">
                    This platform provides AI-assisted legal guidance for informational purposes only. 
                    For legal advice, please consult a qualified lawyer. In emergencies, contact your nearest police station immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-primary-200 text-sm">
              © {new Date().getFullYear()} LegalSift. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-primary-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-primary-200 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
