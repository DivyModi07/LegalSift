import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  Eye,
  EyeOff,
  Scale
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sendOTP, verifyOTP, resetPassword } from '../services/userService';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setIsLoading(true);
      try {
        const result = await sendOTP(formData.email);
        if (result.success) {
          toast.success('OTP sent to your email!');
          setStep(2);
        } else {
          toast.error(result.error || 'Failed to send OTP');
        }
      } catch (error) {
        toast.error('Failed to send OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2 && validateStep2()) {
      setIsVerifyingOTP(true);
      try {
        const result = await verifyOTP(formData.email, formData.otp);
        if (result.success) {
          toast.success('OTP verified successfully!');
          setStep(3);
        } else {
          toast.error(result.error || 'Invalid OTP');
        }
      } catch (error) {
        toast.error('Failed to verify OTP. Please try again.');
      } finally {
        setIsVerifyingOTP(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await resetPassword(formData.email, formData.newPassword);
      
      if (result.success) {
        toast.success('Password reset successfully! You can now login with your new password.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await sendOTP(formData.email);
      if (result.success) {
        toast.success('OTP resent successfully!');
      } else {
        toast.error(result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = [
    'Enter Email',
    'Verify Code',
    'New Password'
  ];

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

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-start">
            <Link 
              to="/login" 
              className="inline-flex items-center text-[#7A7A7A] hover:text-[#C9A227] transition-colors duration-300 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Login</span>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#C9A227] to-[#b8911f] rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="h-8 w-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-[#1C1C1C] mb-3 tracking-tight">
                Reset Password
              </h2>
              <p className="text-[#7A7A7A] text-base leading-relaxed">
                Enter your email to receive a verification code
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#b8911f] text-white shadow-lg transform scale-110' 
                    : 'bg-gray-200 text-[#7A7A7A]'
                }`}>
                  {stepNumber}
                </div>
                <div className="text-xs text-[#7A7A7A] mt-2 font-medium hidden sm:block">
                  {stepTitles[stepNumber - 1]}
                </div>
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-0.5 mx-3 transition-colors duration-300 ${
                  step > stepNumber ? 'bg-[#C9A227]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Email */}
            {step === 1 && (
              <>
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

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#C9A227] to-[#b8911f] hover:from-[#b8911f] hover:to-[#a68019] text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Send OTP</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </button>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <>
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#C9A227] to-[#b8911f] rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1C1C1C] font-medium mb-2">
                      Verification code sent!
                    </p>
                    <p className="text-[#7A7A7A] text-sm">
                      We've sent a 6-digit code to <strong className="text-[#C9A227]">{formData.email}</strong>
                    </p>
                    <p className="text-sm text-[#7A7A7A] mt-2">
                      Please check your email and enter the code below.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-semibold text-[#1C1C1C] text-center">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength="6"
                    required
                    className={`w-full py-4 px-4 rounded-xl border-2 ${
                      errors.otp 
                        ? 'border-[#6B2F2F] focus:border-[#6B2F2F] focus:ring-[#6B2F2F]' 
                        : 'border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A227]'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-300 bg-gray-50 focus:bg-white text-[#1C1C1C] placeholder-[#7A7A7A] text-center text-xl tracking-widest font-bold`}
                    placeholder="000000"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                  {errors.otp && (
                    <p className="text-sm text-[#6B2F2F] flex items-center justify-center mt-1">
                      <span className="mr-1">⚠️</span>
                      {errors.otp}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="text-[#C9A227] hover:text-[#1C1C1C] text-sm font-semibold transition-colors duration-300 hover:underline"
                  >
                    {isLoading ? 'Sending...' : "Didn't receive code? Resend"}
                  </button>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 py-3 px-6 border-2 border-[#7A7A7A] text-[#7A7A7A] font-semibold rounded-xl hover:bg-[#7A7A7A] hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isVerifyingOTP}
                    className="flex-1 py-3 bg-gradient-to-r from-[#C9A227] to-[#b8911f] hover:from-[#b8911f] hover:to-[#a68019] text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isVerifyingOTP ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Verify OTP</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <>
                <div className="text-center space-y-4 mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#C9A227] to-[#b8911f] rounded-full flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1C1C1C] font-medium mb-2">
                      Create New Password
                    </p>
                    <p className="text-[#7A7A7A] text-sm">
                      Enter a strong password for your account
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-[#1C1C1C]">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute inset-y-0 left-4 h-5 w-5 text-[#7A7A7A] my-auto group-focus-within:text-[#C9A227] transition-colors duration-300" />
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 ${
                        errors.newPassword 
                          ? 'border-[#6B2F2F] focus:border-[#6B2F2F] focus:ring-[#6B2F2F]' 
                          : 'border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A227]'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-300 bg-gray-50 focus:bg-white text-[#1C1C1C] placeholder-[#7A7A7A]`}
                      placeholder="Create a strong password"
                      value={formData.newPassword}
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
                  {errors.newPassword && (
                    <p className="text-sm text-[#6B2F2F] flex items-center mt-1">
                      <span className="mr-1">⚠️</span>
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1C1C1C]">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute inset-y-0 left-4 h-5 w-5 text-[#7A7A7A] my-auto group-focus-within:text-[#C9A227] transition-colors duration-300" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 ${
                        errors.confirmPassword 
                          ? 'border-[#6B2F2F] focus:border-[#6B2F2F] focus:ring-[#6B2F2F]' 
                          : 'border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A227]'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-300 bg-gray-50 focus:bg-white text-[#1C1C1C] placeholder-[#7A7A7A]`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center text-[#7A7A7A] hover:text-[#C9A227] transition-colors duration-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-[#6B2F2F] flex items-center mt-1">
                      <span className="mr-1">⚠️</span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 py-3 px-6 border-2 border-[#7A7A7A] text-[#7A7A7A] font-semibold rounded-xl hover:bg-[#7A7A7A] hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-[#C9A227] to-[#b8911f] hover:from-[#b8911f] hover:to-[#a68019] text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Back to Login Link */}
        <div className="text-center">
          <p className="text-neutral-600">
            Remember your password?{' '}
            <Link to="/login" className="text-[#C9A227] hover:text-[#1C1C1C] font-medium transition">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;