import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register, sendOTP, verifyOTP, checkEmailPhone, isLoading, isVerifyingOTP } = useAuthStore();
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      // Check email and phone availability first
      const checkResult = await checkEmailPhone(formData.email, formData.phone);
      if (checkResult.success) {
        setStep(2);
      } else {
        // Show validation errors
        if (checkResult.error.email) {
          setErrors(prev => ({ ...prev, email: checkResult.error.email }));
        }
        if (checkResult.error.phone) {
          setErrors(prev => ({ ...prev, phone: checkResult.error.phone }));
        }
      }
    } else if (step === 2 && validateStep2()) {
      // Send OTP when moving from step 2 to step 3
      const result = await sendOTP(formData.email);
      if (result.success) {
        toast.success('OTP sent to your email!');
        setStep(3);
      } else {
        toast.error(result.error || 'Failed to send OTP');
      }
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    // First verify OTP
    const otpResult = await verifyOTP(formData.email, formData.otp);
    
    if (otpResult.success) {
      // Then complete registration
      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
      };
      
      const registerResult = await register(registrationData);
      
      if (registerResult.success) {
        toast.success('🎉 Registration successful! Welcome to LegalSift!');
        // Small delay to show the success message before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error(registerResult.error || 'Registration failed');
      }
    } else {
      toast.error(otpResult.error || 'Invalid OTP');
    }
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
    const result = await sendOTP(formData.email);
    if (result.success) {
      toast.success('OTP resent successfully!');
    } else {
      toast.error(result.error || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Create your account
          </h2>
          <p className="text-neutral-600">
            Join LegalSift to get started with legal assistance
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

        {/* Registration Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        className={`form-input pl-10 ${errors.firstName ? 'border-error' : ''}`}
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="form-error">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        className={`form-input pl-10 ${errors.lastName ? 'border-error' : ''}`}
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="form-error">{errors.lastName}</p>
                    )}
                  </div>
                </div>

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

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      className={`form-input pl-10 ${errors.phone ? 'border-error' : ''}`}
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && (
                    <p className="form-error">{errors.phone}</p>
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
                       Checking...
                     </div>
                   ) : (
                     <div className="flex items-center justify-center">
                       Next
                       <ArrowRight className="ml-2 h-4 w-4" />
                     </div>
                   )}
                 </button>
              </>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <>
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`form-input pl-10 pr-10 ${errors.password ? 'border-error' : ''}`}
                      placeholder="Create a strong password"
                      value={formData.password}
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
                  {errors.password && (
                    <p className="form-error">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
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
                      placeholder="Confirm your password"
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
                     type="button"
                     onClick={handleNext}
                     disabled={isVerifyingOTP}
                     className="btn btn-primary flex-1 py-3"
                   >
                     {isVerifyingOTP ? (
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
                </div>
              </>
            )}

            {/* Step 3: OTP Verification */}
            {step === 3 && (
              <>
                                 <div className="text-center">
                   <p className="text-neutral-600 mb-4">
                     We've sent a 6-digit verification code to <strong>{formData.email}</strong>
                   </p>
                   <p className="text-sm text-neutral-500 mb-4">
                     Please check your email and enter the code below to complete your registration.
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
                    disabled={isVerifyingOTP}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    {isVerifyingOTP ? 'Sending...' : "Didn't receive code? Resend"}
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
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary flex-1 py-3"
                  >
                                         {isLoading ? (
                       <div className="flex items-center justify-center">
                         <div className="spinner h-5 w-5 mr-2"></div>
                         Creating Account...
                       </div>
                     ) : (
                       'Complete Registration'
                     )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
