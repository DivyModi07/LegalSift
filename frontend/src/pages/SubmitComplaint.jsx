import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Shield,
  ArrowLeft,
  Send,
  Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const SubmitComplaint = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    state: '',
    city: '',
    complaint: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

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

  const cities = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Ghaziabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'],
    'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Adilabad'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda']
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select your city';
    }
    
    if (!formData.complaint.trim()) {
      newErrors.complaint = 'Please describe your complaint';
    } else if (formData.complaint.trim().length < 50) {
      newErrors.complaint = 'Please provide more details (at least 50 characters)';
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
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis(formData.complaint);
      setAnalysisResult(mockAnalysis);
      setShowResult(true);
      setIsSubmitting(false);
      toast.success('Complaint analyzed successfully!');
    }, 3000);
  };

  const generateMockAnalysis = (complaint) => {
    const complaintLower = complaint.toLowerCase();
    
    // Simple keyword-based analysis
    if (complaintLower.includes('fraud') || complaintLower.includes('scam') || complaintLower.includes('cheat')) {
      return {
        section: '420',
        title: 'Cheating and Dishonestly Inducing Delivery of Property',
        description: 'This involves cheating and dishonestly inducing a person to deliver any property or valuable security.',
        category: 'Fraud',
        punishment: 'Imprisonment up to 7 years and fine',
        bailable: 'Non-bailable',
        urgency: 'high',
        jurisdiction: 'Local Police Station',
        recommendation: 'Contact nearest police station immediately. This is a serious offense.',
        lawyers: [
          { name: 'Adv. Rajesh Kumar', phone: '+91 9876543210', fees: '₹5,000', experience: '15 years' },
          { name: 'Adv. Priya Sharma', phone: '+91 9876543211', fees: '₹4,500', experience: '12 years' },
          { name: 'Adv. Amit Patel', phone: '+91 9876543212', fees: '₹6,000', experience: '18 years' }
        ]
      };
    } else if (complaintLower.includes('theft') || complaintLower.includes('steal') || complaintLower.includes('robbery')) {
      return {
        section: '379',
        title: 'Theft',
        description: 'Whoever commits theft shall be punished with imprisonment.',
        category: 'Theft',
        punishment: 'Imprisonment up to 3 years, or fine, or both',
        bailable: 'Bailable',
        urgency: 'medium',
        jurisdiction: 'Local Police Station',
        recommendation: 'File an FIR at your nearest police station.',
        lawyers: [
          { name: 'Adv. Suresh Verma', phone: '+91 9876543213', fees: '₹3,500', experience: '10 years' },
          { name: 'Adv. Meera Singh', phone: '+91 9876543214', fees: '₹4,000', experience: '14 years' }
        ]
      };
    } else if (complaintLower.includes('harassment') || complaintLower.includes('molest') || complaintLower.includes('assault')) {
      return {
        section: '354',
        title: 'Assault or Criminal Force to Woman with Intent to Outrage her Modesty',
        description: 'Whoever assaults or uses criminal force to any woman intending to outrage or knowing it to be likely that he will thereby outrage her modesty.',
        category: 'Harassment',
        punishment: 'Imprisonment up to 2 years, or fine, or both',
        bailable: 'Bailable',
        urgency: 'high',
        jurisdiction: 'Local Police Station',
        recommendation: 'Contact nearest police station immediately. This is a serious offense.',
        lawyers: [
          { name: 'Adv. Kavita Reddy', phone: '+91 9876543215', fees: '₹5,500', experience: '16 years' },
          { name: 'Adv. Sunil Kumar', phone: '+91 9876543216', fees: '₹4,800', experience: '13 years' }
        ]
      };
    } else {
      return {
        section: 'General',
        title: 'General Legal Matter',
        description: 'This appears to be a general legal matter that may require consultation with a legal expert.',
        category: 'General',
        punishment: 'Varies based on specific circumstances',
        bailable: 'Depends on offense',
        urgency: 'low',
        jurisdiction: 'Local Police Station',
        recommendation: 'Contact nearest police station for guidance.',
        lawyers: [
          { name: 'Adv. General Counsel', phone: '+91 9876543217', fees: '₹3,000', experience: '8 years' }
        ]
      };
    }
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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-neutral-600';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <Clock className="h-5 w-5" />;
      case 'low': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
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
            Submit Complaint
          </h1>
          <p className="text-neutral-600">
            Describe your legal issue and get instant AI analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Complaint Form */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="bg-primary-100 p-2 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Complaint Details
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* State Selection */}
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

              {/* City Selection */}
              <div>
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.state}
                  className={`form-input ${errors.city ? 'border-error' : ''}`}
                >
                  <option value="">Select your city</option>
                  {formData.state && cities[formData.state]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="form-error">{errors.city}</p>
                )}
              </div>

              {/* Complaint Description */}
              <div>
                <label htmlFor="complaint" className="form-label">
                  Describe Your Complaint
                </label>
                <textarea
                  id="complaint"
                  name="complaint"
                  rows={8}
                  className={`form-input ${errors.complaint ? 'border-error' : ''}`}
                  placeholder="Please provide a detailed description of your legal issue. Include relevant dates, names, and any supporting details..."
                  value={formData.complaint}
                  onChange={handleChange}
                />
                {errors.complaint && (
                  <p className="form-error">{errors.complaint}</p>
                )}
                <p className="text-sm text-neutral-500 mt-1">
                  {formData.complaint.length}/1000 characters
                </p>
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
                    Analyzing Complaint...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Submit for Analysis
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Analysis Result */}
          <div className="space-y-6">
            {showResult && analysisResult && (
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-success/10 p-2 rounded-lg mr-3">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">
                    AI Analysis Result
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* IPC Section */}
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-primary-900 mb-2">
                      IPC Section {analysisResult.section}
                    </h3>
                    <p className="text-primary-800 font-medium">
                      {analysisResult.title}
                    </p>
                    <p className="text-primary-700 text-sm mt-1">
                      {analysisResult.description}
                    </p>
                  </div>

                  {/* Category and Urgency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-sm text-neutral-600">Category</p>
                      <p className="font-semibold text-neutral-900">{analysisResult.category}</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-sm text-neutral-600">Urgency</p>
                      <div className={`flex items-center font-semibold ${getUrgencyColor(analysisResult.urgency)}`}>
                        {getUrgencyIcon(analysisResult.urgency)}
                        <span className="ml-1 capitalize">{analysisResult.urgency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Punishment and Bailability */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-sm text-neutral-600">Punishment</p>
                      <p className="font-semibold text-neutral-900">{analysisResult.punishment}</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-sm text-neutral-600">Bailability</p>
                      <p className="font-semibold text-neutral-900">{analysisResult.bailable}</p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Recommendation</h4>
                    <p className="text-amber-700">{analysisResult.recommendation}</p>
                  </div>

                  {/* Lawyer Recommendations for High Urgency */}
                  {analysisResult.urgency === 'high' && analysisResult.lawyers && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">Recommended Lawyers</h4>
                      <div className="space-y-3">
                        {analysisResult.lawyers.map((lawyer, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-green-200">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-green-900">{lawyer.name}</h5>
                              <span className="text-sm font-medium text-green-700">{lawyer.fees}</span>
                            </div>
                            <div className="text-sm text-green-700 space-y-1">
                              <p>Phone: {lawyer.phone}</p>
                              <p>Experience: {lawyer.experience}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Information Box */}
            <div className="card p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>• This analysis is for informational purposes only</li>
                <li>• For legal advice, consult a qualified lawyer</li>
                <li>• In emergencies, contact your nearest police station immediately</li>
                <li>• Keep all relevant documents and evidence safe</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
