import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Send,
  ArrowLeft,
  Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LawyerApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    barCouncilNumber: '',
    experience: '',
    specialization: '',
    education: '',
    practiceAreas: [],
    fees: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
  ];

  const practiceAreas = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Property Law',
    'Corporate Law',
    'Tax Law',
    'Constitutional Law',
    'Cyber Law',
    'Intellectual Property',
    'Labor Law',
    'Environmental Law',
    'Banking Law',
    'Insurance Law',
    'Real Estate Law',
    'International Law'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
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
    
    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select your city';
    }
    
    if (!formData.barCouncilNumber) {
      newErrors.barCouncilNumber = 'Bar Council number is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Years of experience is required';
    }
    
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }
    
    if (!formData.education) {
      newErrors.education = 'Educational background is required';
    }
    
    if (formData.practiceAreas.length === 0) {
      newErrors.practiceAreas = 'Please select at least one practice area';
    }
    
    if (!formData.fees) {
      newErrors.fees = 'Please specify your consultation fees';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a brief description about your practice';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Application submitted successfully! We will review and get back to you soon.');
      navigate('/');
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear city when state changes
    if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ''
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePracticeAreaChange = (area) => {
    setFormData(prev => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter(a => a !== area)
        : [...prev.practiceAreas, area]
    }));
    
    if (errors.practiceAreas) {
      setErrors(prev => ({
        ...prev,
        practiceAreas: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Lawyer Application
          </h1>
          <p className="text-neutral-600">
            Join our network of qualified legal professionals
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="bg-primary-100 p-3 rounded-lg mr-3">
                <Briefcase className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Application Form
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`form-input pl-10 ${errors.name ? 'border-error' : ''}`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && (
                    <p className="form-error">{errors.name}</p>
                  )}
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

                <div>
                  <label htmlFor="barCouncilNumber" className="form-label">
                    Bar Council Number
                  </label>
                  <input
                    id="barCouncilNumber"
                    name="barCouncilNumber"
                    type="text"
                    className={`form-input ${errors.barCouncilNumber ? 'border-error' : ''}`}
                    placeholder="Enter your bar council number"
                    value={formData.barCouncilNumber}
                    onChange={handleChange}
                  />
                  {errors.barCouncilNumber && (
                    <p className="form-error">{errors.barCouncilNumber}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`form-input ${errors.state ? 'border-error' : ''}`}
                  >
                    <option value="">Select your state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="form-error">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={`form-input ${errors.city ? 'border-error' : ''}`}
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && (
                    <p className="form-error">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="experience" className="form-label">
                    Years of Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`form-input ${errors.experience ? 'border-error' : ''}`}
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="15+">15+ years</option>
                  </select>
                  {errors.experience && (
                    <p className="form-error">{errors.experience}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="specialization" className="form-label">
                    Primary Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    className={`form-input ${errors.specialization ? 'border-error' : ''}`}
                    placeholder="e.g., Criminal Law, Corporate Law"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                  {errors.specialization && (
                    <p className="form-error">{errors.specialization}</p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <label htmlFor="education" className="form-label">
                  Educational Background
                </label>
                <textarea
                  id="education"
                  name="education"
                  rows={3}
                  className={`form-input ${errors.education ? 'border-error' : ''}`}
                  placeholder="Describe your educational qualifications, law school, etc."
                  value={formData.education}
                  onChange={handleChange}
                />
                {errors.education && (
                  <p className="form-error">{errors.education}</p>
                )}
              </div>

              {/* Practice Areas */}
              <div>
                <label className="form-label">
                  Practice Areas
                </label>
                <div className="grid md:grid-cols-3 gap-3">
                  {practiceAreas.map((area) => (
                    <label key={area} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.practiceAreas.includes(area)}
                        onChange={() => handlePracticeAreaChange(area)}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">{area}</span>
                    </label>
                  ))}
                </div>
                {errors.practiceAreas && (
                  <p className="form-error">{errors.practiceAreas}</p>
                )}
              </div>

              {/* Fees */}
              <div>
                <label htmlFor="fees" className="form-label">
                  Consultation Fees (per hour)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                    ₹
                  </span>
                  <input
                    id="fees"
                    name="fees"
                    type="number"
                    className={`form-input pl-8 ${errors.fees ? 'border-error' : ''}`}
                    placeholder="Enter your consultation fees"
                    value={formData.fees}
                    onChange={handleChange}
                  />
                </div>
                {errors.fees && (
                  <p className="form-error">{errors.fees}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="form-label">
                  About Your Practice
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className={`form-input ${errors.description ? 'border-error' : ''}`}
                  placeholder="Tell us about your practice, notable cases, achievements, etc."
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <p className="form-error">{errors.description}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Submitting Application...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Submit Application
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Information Box */}
          <div className="mt-6 card p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Application Process</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• We will review your application within 3-5 business days</li>
                  <li>• You will receive an email notification about the status</li>
                  <li>• Approved lawyers will be added to our network</li>
                  <li>• You can update your profile and availability after approval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerApplication;
