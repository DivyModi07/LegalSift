import { useState, useRef, useEffect } from 'react';
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
  Loader,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import complaintService from '../services/complaintService';

const SubmitComplaint = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const topRef = useRef(null); // Ref for the scroll target

  const [formData, setFormData] = useState({
    state: '',
    city: '',
    dateOfIncident: '',
    complaint: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Simulate page loading
  useEffect(() => {
    const loadPage = () => {
      // Set loading to false after a short delay to simulate page load
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    loadPage();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city';
    }

    if (!formData.dateOfIncident) {
      newErrors.dateOfIncident = 'Please select the date of the incident';
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
    setAnalysisResult(null); 
    setShowResult(false);
    
    try {
      // --- THIS IS THE FIX ---
      // Pass the entire formData object to the service.
      const response = await complaintService.submitComplaintForAnalysis(formData);
      
      const formattedResult = {
        urgency: response.predicted_urgency,
        category: response.predicted_category,
        sections: response.recommended_sections,
      };
      
      setAnalysisResult(formattedResult);
      setShowResult(true);
      toast.success('Complaint analyzed successfully!');

      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      // This part is what shows you the error message.
      console.error('Error submitting complaint:', error.response?.data || error);
      toast.error('Failed to analyze complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const toggleDetails = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-12 w-12 animate-spin text-[#C9A227]" />
          <p className="text-[#7A7A7A] text-lg font-medium">Loading complaint form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - This is the scroll target */}
        <div className="mb-8" ref={topRef}>
          
          {/* Header Section with Gradient Background */}
          <div className="relative mb-12 p-8 bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] rounded-2xl shadow-xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227] opacity-10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-3">
                Submit <span className="text-[#C9A227]">Legal Complaint</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Describe your legal issue and get instant AI analysis with recommended IPC sections.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Complaint Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2D2D2D] px-8 py-6">
              <div className="flex items-center">
                <div className="bg-[#C9A227] p-2 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Complaint Details
                </h2>
              </div>
              <p className="text-gray-300 mt-2">Fill in the details to get AI-powered legal analysis</p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State Selection */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all duration-200 bg-white text-[#1C1C1C] ${
                        errors.state ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select your state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-600 text-sm mt-1 font-medium">{errors.state}</p>
                    )}
                  </div>

                  {/* City Text Field */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all duration-200 bg-white text-[#1C1C1C] placeholder-[#7A7A7A] ${
                        errors.city ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1 font-medium">{errors.city}</p>
                    )}
                  </div>
                </div>

                {/* Date of Incident */}
                <div>
                  <label htmlFor="dateOfIncident" className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                    <Calendar className="inline h-4 w-4 mr-1 text-[#C9A227]" />
                    Date of Incident
                  </label>
                  <input
                    type="date"
                    id="dateOfIncident"
                    name="dateOfIncident"
                    value={formData.dateOfIncident}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all duration-200 bg-white text-[#1C1C1C] ${
                      errors.dateOfIncident ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                    }`}
                    // Prevent future dates from being selected
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.dateOfIncident && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.dateOfIncident}</p>
                  )}
                </div>

                {/* Complaint Description */}
                <div>
                  <label htmlFor="complaint" className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                    Describe Your Complaint
                  </label>
                  <textarea
                    id="complaint"
                    name="complaint"
                    rows={8}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all duration-200 bg-white text-[#1C1C1C] placeholder-[#7A7A7A] resize-none ${
                      errors.complaint ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="Please provide a detailed description of your legal issue. Include relevant dates, names, and any supporting details..."
                    value={formData.complaint}
                    onChange={handleChange}
                  />
                  {errors.complaint && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.complaint}</p>
                  )}
                  <p className="text-sm text-[#7A7A7A] mt-2 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                    {formData.complaint.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#C9A227] to-[#D4B332] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          </div>

          {/* Analysis Result */}
          <div className="space-y-6">
            {showResult && analysisResult && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2D2D2D] px-8 py-6">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-2 rounded-lg mr-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      AI Analysis Result
                    </h2>
                  </div>
                  <p className="text-gray-300 mt-2">Comprehensive legal analysis of your complaint</p>
                </div>

                {/* Result Content */}
                <div className="p-8 space-y-6">
                  {/* Category and Urgency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                      <p className="text-sm text-[#7A7A7A] mb-1 font-medium">Predicted Category</p>
                      <p className="font-bold text-[#1C1C1C] text-lg">{analysisResult.category}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                      <p className="text-sm text-[#7A7A7A] mb-1 font-medium">Predicted Urgency</p>
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getUrgencyColor(analysisResult.urgency)}`}>
                        {getUrgencyIcon(analysisResult.urgency)}
                        <span className="ml-2 capitalize font-bold">{analysisResult.urgency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Sections */}
                  <div className="bg-gradient-to-br from-[#C9A227]/5 to-[#C9A227]/10 p-6 rounded-xl border-2 border-[#C9A227]/20">
                    <h3 className="font-bold text-[#1C1C1C] text-xl mb-4 flex items-center">
                      <Shield className="h-6 w-6 mr-2 text-[#C9A227]" />
                      Recommended IPC Sections
                    </h3>
                    <div className="space-y-4">
                      {analysisResult.sections.map((section, index) => (
                        <div key={index} className="bg-white p-6 border-2 border-[#C9A227]/20 rounded-xl hover:shadow-lg transition-all duration-300">
                          <p className="text-[#1C1C1C] font-bold text-lg mb-2">
                            Section {section.section_number}: {section.title}
                          </p>
                          <p className="text-[#7A7A7A] mb-4 leading-relaxed">
                            {section.short_description}
                          </p>
                          
                          {/* View Details Button */}
                          <div className="border-t border-gray-200 pt-4">
                            <button
                              onClick={() => toggleDetails(section.section_number)}
                              className="flex items-center justify-between w-full text-[#C9A227] hover:text-[#D4B332] font-bold transition-colors duration-200 py-2"
                            >
                              <span>
                                {expandedSection === section.section_number ? 'Hide Details' : 'View Details'}
                              </span>
                              {expandedSection === section.section_number ? (
                                <ChevronUp className="h-5 w-5 ml-2 transition-transform duration-200" />
                              ) : (
                                <ChevronDown className="h-5 w-5 ml-2 transition-transform duration-200" />
                              )}
                            </button>

                            {/* Collapsible Details Content */}
                            {expandedSection === section.section_number && (
                              <div className="mt-4 grid grid-cols-1 gap-4 animate-in slide-in-from-top duration-300">
                                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-sm text-[#7A7A7A] mb-1 font-medium">Punishment</p>
                                  <p className="font-semibold text-[#1C1C1C]">{section.punishment}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-sm text-[#7A7A7A] mb-1 font-medium">Bailability</p>
                                  <p className="font-semibold text-[#1C1C1C]">{section.bailability_status}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-sm text-[#7A7A7A] mb-1 font-medium">Court Jurisdiction</p>
                                  <p className="font-semibold text-[#1C1C1C]">{section.court_jurisdiction}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Information Box */}
                  <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 shadow-md">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      <AlertTriangle className="h-5 w-5 mr-2" />Important Information
                    </h3>
                    <ul className="text-yellow-800 space-y-2 leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-yellow-700 text-sm leading-relaxed">•</span>
                        This analysis is for informational purposes only
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-700 text-sm leading-relaxed">•</span>
                        For legal advice, consult a qualified lawyer
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-700 text-sm leading-relaxed">•</span>
                        In emergencies, contact your nearest police station immediately
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-700 text-sm leading-relaxed">•</span>
                        Keep all relevant documents and evidence safe
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;