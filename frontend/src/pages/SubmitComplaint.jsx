import { useState, useRef } from 'react';
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

  const toggleDetails = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8">
        {/* Header - This is the scroll target */}
        <div className="mb-8" ref={topRef}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* City Text Field */}
                <div>
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`form-input ${errors.city ? 'border-error' : ''}`}
                  />
                  {errors.city && (
                    <p className="form-error">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Date of Incident */}
              <div>
                <label htmlFor="dateOfIncident" className="form-label">
                  Date of Incident
                </label>
                <input
                  type="date"
                  id="dateOfIncident"
                  name="dateOfIncident"
                  value={formData.dateOfIncident}
                  onChange={handleChange}
                  className={`form-input ${errors.dateOfIncident ? 'border-error' : ''}`}
                  // Prevent future dates from being selected
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.dateOfIncident && (
                  <p className="form-error">{errors.dateOfIncident}</p>
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
                  {/* Category and Urgency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-sm text-neutral-600">Predicted Category</p>
                      <p className="font-semibold text-neutral-900">{analysisResult.category}</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-sm text-neutral-600">Predicted Urgency</p>
                      <div className={`flex items-center font-semibold ${getUrgencyColor(analysisResult.urgency)}`}>
                        {getUrgencyIcon(analysisResult.urgency)}
                        <span className="ml-1 capitalize">{analysisResult.urgency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Sections */}
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-primary-900 mb-2">
                      Recommended IPC Sections
                    </h3>
                    {analysisResult.sections.map((section, index) => (
                      <div key={index} className="mb-3 last:mb-0 p-3 border rounded-lg bg-white border-primary-100">
                        <p className="text-primary-800 font-medium">
                          Section {section.section_number}: {section.title}
                        </p>
                        <p className="text-primary-700 text-sm mt-1">
                          {section.short_description}
                        </p>
                        
                        {/* View Details Button */}
                        <div className="mt-4 border-t border-neutral-200 pt-4">
                          <button
                            onClick={() => toggleDetails(section.section_number)}
                            className="flex items-center justify-between w-full text-primary-600 hover:text-primary-500 font-medium transition-colors"
                          >
                            <span>
                              {expandedSection === section.section_number ? 'Hide Details' : 'View Details'}
                            </span>
                            {expandedSection === section.section_number ? (
                              <ChevronUp className="h-4 w-4 ml-2" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-2" />
                            )}
                          </button>

                          {/* Collapsible Details Content */}
                          {expandedSection === section.section_number && (
                            <div className="mt-4 space-y-3 p-4 bg-neutral-50 rounded-lg">
                               <div className="bg-white p-3 rounded-lg">
                                  <p className="text-sm text-neutral-600 mb-1">Punishment</p>
                                  <p className="font-medium text-neutral-900 text-sm">{section.punishment}</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                  <p className="text-sm text-neutral-600 mb-1">Bailability</p>
                                  <p className="font-medium text-neutral-900 text-sm">{section.bailability_status}</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                  <p className="text-sm text-neutral-600 mb-1">Court</p>
                                  <p className="font-medium text-neutral-900 text-sm">{section.court_jurisdiction}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;