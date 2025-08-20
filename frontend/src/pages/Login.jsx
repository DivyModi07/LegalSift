import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Scale } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        const userRole = useAuthStore.getState().userRole;
        if (userRole === 'admin') {
          navigate('/admin/complaints');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5] px-6 py-12 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-50" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>

      {/* Main Login Container */}
      <div className="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative z-10 backdrop-blur-sm">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          {/* Back to Home Link */}
          <div className="flex justify-start">
            <Link 
              to="/" 
              className="inline-flex items-center text-[#7A7A7A] hover:text-[#C9A227] transition-colors duration-300 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#C9A227] to-[#b8911f] rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="h-8 w-8 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-[#1C1C1C] mb-3 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-[#7A7A7A] text-base leading-relaxed">
                Sign in to continue your legal journey with 
                <span className="text-[#C9A227] font-semibold"> LegalSift</span>
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8" noValidate>
          
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-[#1C1C1C]">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute inset-y-0 left-4 h-5 w-5 text-[#7A7A7A] my-auto group-focus-within:text-[#C9A227] transition-colors duration-300" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                  errors.email 
                    ? 'border-[#6B2F2F] focus:border-[#6B2F2F] focus:ring-[#6B2F2F]' 
                    : 'border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A227]'
                } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-300 bg-gray-50 focus:bg-white text-[#1C1C1C] placeholder-[#7A7A7A]`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-[#6B2F2F] flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-[#1C1C1C]">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute inset-y-0 left-4 h-5 w-5 text-[#7A7A7A] my-auto group-focus-within:text-[#C9A227] transition-colors duration-300" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 ${
                  errors.password 
                    ? 'border-[#6B2F2F] focus:border-[#6B2F2F] focus:ring-[#6B2F2F]' 
                    : 'border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A227]'
                } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-300 bg-gray-50 focus:bg-white text-[#1C1C1C] placeholder-[#7A7A7A]`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-[#7A7A7A] hover:text-[#C9A227] transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-[#6B2F2F] flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-[#7A7A7A]">Having trouble signing in?</span>
            <Link 
              to="/forgot-password" 
              className="font-semibold text-[#C9A227] hover:text-[#1C1C1C] transition-colors duration-300 hover:underline"
            >
              Reset password
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#C9A227] to-[#b8911f] hover:from-[#b8911f] hover:to-[#a68019] text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                <span>Signing you in...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <Scale className="h-5 w-5 mr-2" />
                Sign In to LegalSift
              </span>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[#7A7A7A]">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#C9A227] hover:text-[#1C1C1C] font-medium transition">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;