import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  ArrowLeft
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#FAFAF5] font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Gradient Background */}
        <div className="relative mb-12 p-8 bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] rounded-2xl shadow-xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227] opacity-10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
           
            <h1 className="text-4xl font-bold text-white mb-3">
              Profile <span className="text-[#C9A227]">Settings</span>
            </h1>
            <p className="text-gray-300 text-lg">
              View your account information
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2D2D2D] px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <User className="h-8 w-8 text-[#C9A227] mr-3" />
                Personal Information
              </h2>
              <p className="text-gray-300">Your account details are displayed below.</p>
            </div>

            {/* Card Content */}
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#1C1C1C] mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#C9A227]" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-[#1C1C1C] font-medium cursor-not-allowed"
                      value={user?.name || ''}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1C1C1C] mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#C9A227]" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-[#1C1C1C] font-medium cursor-not-allowed"
                      value={user?.email || ''}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#1C1C1C] mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-[#C9A227]" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-[#1C1C1C] font-medium cursor-not-allowed"
                      value={user?.phone_number || ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;