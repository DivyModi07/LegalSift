import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  Eye,
  EyeOff
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

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Reset your password
          </h2>
          <p className="text-neutral-600">
            Enter your email to receive a verification code
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-200 text-neutral-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  step > stepNumber ? 'bg-primary-500' : 'bg-neutral-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Email */}
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`form-input pl-10 ${errors.email ? 'border-error' : ''}`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="form-error">{errors.email}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="btn btn-primary w-full py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner h-5 w-5 mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Send OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </button>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <>
                <div className="text-center">
                  <p className="text-neutral-600 mb-4">
                    We've sent a 6-digit verification code to <strong>{formData.email}</strong>
                  </p>
                  <p className="text-sm text-neutral-500 mb-4">
                    Please check your email and enter the code below.
                  </p>
                </div>

                <div>
                  <label htmlFor="otp" className="form-label">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength="6"
                    required
                    className={`form-input text-center text-lg tracking-widest ${errors.otp ? 'border-error' : ''}`}
                    placeholder="000000"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                  {errors.otp && (
                    <p className="form-error">{errors.otp}</p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    {isLoading ? 'Sending...' : "Didn't receive code? Resend"}
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn btn-secondary flex-1 py-3"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isVerifyingOTP}
                    className="btn btn-primary flex-1 py-3"
                  >
                    {isVerifyingOTP ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner h-5 w-5 mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Verify OTP
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <>
                <div className="text-center">
                  <p className="text-neutral-600 mb-4">
                    Create a new password for your account
                  </p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`form-input pl-10 pr-10 ${errors.newPassword ? 'border-error' : ''}`}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="form-error">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`form-input pl-10 pr-10 ${errors.confirmPassword ? 'border-error' : ''}`}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="form-error">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn btn-secondary flex-1 py-3"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary flex-1 py-3"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner h-5 w-5 mr-2"></div>
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
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
