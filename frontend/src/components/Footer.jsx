import { Link } from 'react-router-dom';
import { Scale, AlertTriangle, Mail, Phone, MapPin, Twitter, Linkedin, Globe } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Footer = () => {
  const { isAuthenticated } = useAuthStore();

  const getQuickLinks = () => {
    if (isAuthenticated) {
      return [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/submit-complaint', label: 'Submit Complaint' },
        { to: '/ipc-explorer', label: 'IPC Explorer' },
        { to: '/chatbot', label: 'Legal Assistant' },
      ];
    }
    return [
      { to: '/', label: 'Home' },
      { to: '/ipc-explorer', label: 'IPC Explorer' },
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ];
  };

  const legalLinks = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms-of-service', label: 'Terms of Service' },
  ];

  const quickLinks = getQuickLinks();

  return (
    <footer className="bg-stone-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-xl font-bold text-white">LegalSift</span>
            </div>
            <p className="text-stone-300 text-sm mb-6 leading-relaxed">
              Empowering citizens with AI-driven legal assistance and comprehensive IPC exploration tools. Making justice accessible through technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="block text-stone-300 hover:text-yellow-400 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Legal
            </h3>
            <div className="space-y-2">
              {legalLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="block text-stone-300 hover:text-yellow-400 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Emergency */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="bg-stone-700 p-2 rounded-lg mr-3">
                  <Mail className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-stone-400 text-xs">Email</p>
                  <a href="mailto:LegalSift@gmail.com" className="text-stone-300 hover:text-yellow-400 text-sm">
                    LegalSift@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-stone-700 p-2 rounded-lg mr-3">
                  <Phone className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-stone-400 text-xs">Phone</p>
                  <a href="tel:+917069235312" className="text-stone-300 hover:text-yellow-400 text-sm">
                    +91 70692 35312
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-stone-700 p-2 rounded-lg mr-3">
                  <MapPin className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-stone-400 text-xs">Location</p>
                  <span className="text-stone-300 text-sm">Ahmedabad, India</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-700 bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-stone-400 text-sm">
                © {new Date().getFullYear()} LegalSift. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;