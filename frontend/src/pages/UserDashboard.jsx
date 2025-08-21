import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowRight,
  Search,
  Loader,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import complaintService from '../services/complaintService';

const UserDashboard = () => {
  const { user } = useAuthStore();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // State for the "Load More" functionality
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await complaintService.getComplaintHistory();
        // Sort complaints by creation date, newest first
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setComplaints(sortedData);
      } catch (error) {
        toast.error('Could not fetch complaint history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  

  const filteredComplaints = complaints.filter(complaint => {
    const complaintText = complaint.complaint_text || '';
    const category = complaint.predicted_category || '';
    
    return complaintText.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Slice the complaints to only show the visible amount
  const complaintsToShow = filteredComplaints.slice(0, visibleCount);

  const handleLoadMore = () => {
    // Increase the number of visible complaints by 5
    setVisibleCount(prevCount => prevCount + 5);
  };

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-12 w-12 animate-spin text-[#C9A227]" />
          <p className="text-[#7A7A7A] text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
              Welcome back, <span className="text-[#C9A227]">{user?.first_name || 'User'}</span>!
            </h1>
            <p className="text-gray-300 text-lg">
              Your legal assistant is ready to help you manage complaints and get expert guidance.
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Link 
            to="/submit-complaint" 
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100"
          >
            {/* Icon Background with Gradient */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#C9A227] to-[#D4B332] p-4 rounded-xl shadow-lg">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#C9A227] rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <ArrowRight className="h-6 w-6 text-[#7A7A7A] group-hover:text-[#C9A227] transition-all duration-300 transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-bold text-[#1C1C1C] mb-3">Submit New Complaint</h3>
            <p className="text-[#7A7A7A] leading-relaxed">Get instant AI analysis of your legal issue with recommended IPC sections.</p>
          </Link>

          <Link 
            to="/ipc-explorer" 
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] p-4 rounded-xl shadow-lg">
                  <Search className="h-8 w-8 text-[#C9A227]" />
                </div>
                <div className="absolute inset-0 bg-[#1C1C1C] rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <ArrowRight className="h-6 w-6 text-[#7A7A7A] group-hover:text-[#C9A227] transition-all duration-300 transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-bold text-[#1C1C1C] mb-3">Explore IPC Sections</h3>
            <p className="text-[#7A7A7A] leading-relaxed">Search and understand the Indian Penal Code with detailed explanations.</p>
          </Link>

          <Link 
            to="/chatbot" 
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#6B2F2F] to-[#8B3F3F] p-4 rounded-xl shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-[#6B2F2F] rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <ArrowRight className="h-6 w-6 text-[#7A7A7A] group-hover:text-[#C9A227] transition-all duration-300 transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-bold text-[#1C1C1C] mb-3">Legal Assistant</h3>
            <p className="text-[#7A7A7A] leading-relaxed">Get instant answers to your legal questions from our AI assistant.</p>
          </Link>
        </div>

        {/* Complaints Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2D2D2D] px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <FileText className="h-8 w-8 text-[#C9A227] mr-3" />
                  Your Complaints
                </h2>
                <p className="text-gray-300">Track the status and details of your submitted complaints.</p>
              </div>
              <div className="relative mt-4 lg:mt-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#7A7A7A]" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all duration-200 w-full lg:w-80 bg-white text-[#1C1C1C] placeholder-[#7A7A7A]"
                />
              </div>
            </div>
          </div>

          {/* Complaints Content */}
          <div className="p-8">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  <FileText className="h-24 w-24 text-[#7A7A7A] mx-auto opacity-50" />
                  <div className="absolute inset-0 bg-[#C9A227] rounded-full blur-2xl opacity-10"></div>
                </div>
                <h3 className="text-2xl font-bold text-[#1C1C1C] mb-3">
                  {searchTerm ? 'No Complaints Found' : 'No Complaints Yet'}
                </h3>
                <p className="text-[#7A7A7A] text-lg mb-8 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search terms to find what you\'re looking for.' : 'Submit your first complaint to get started with legal analysis.'}
                </p>
                {!searchTerm && (
                  <Link 
                    to="/submit-complaint" 
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#C9A227] to-[#D4B332] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Submit Complaint
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {complaintsToShow.map((complaint) => (
                  <div 
                    key={complaint.id} 
                    className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:from-[#FAFAF5] hover:to-white"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-[#1C1C1C] group-hover:text-[#C9A227] transition-colors duration-200">
                            {complaint.predicted_category}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getUrgencyColor(complaint.predicted_urgency)}`}>
                              {getUrgencyIcon(complaint.predicted_urgency)}
                              <span className="ml-2 capitalize">{complaint.predicted_urgency}</span>
                            </span>
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                              <CheckCircle className="h-4 w-4 mr-2" /> 
                              Analyzed
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-[#7A7A7A] mb-6 leading-relaxed line-clamp-2 text-lg">
                          {complaint.complaint_text}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 text-[#7A7A7A]">
                          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                            <MapPin className="h-4 w-4 mr-2 text-[#C9A227]" />
                            <span className="font-medium">{complaint.city}, {complaint.state}</span>
                          </div>
                          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                            <Calendar className="h-4 w-4 mr-2 text-[#C9A227]" />
                            <span className="font-medium">{new Date(complaint.created_at).toLocaleDateString()}</span>
                          </div>
                          {complaint.recommended_sections?.[0] && (
                            <div className="flex items-center bg-gradient-to-r from-[#C9A227] to-[#D4B332] text-white px-3 py-2 rounded-lg">
                              <Shield className="h-4 w-4 mr-2" />
                              <span className="font-medium">Section: {complaint.recommended_sections[0].section_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 mt-4 lg:mt-0">
                        <button 
                          onClick={() => toggleDetails(complaint.id)} 
                          className="inline-flex items-center px-6 py-3 bg-white border-2 border-[#C9A227] text-[#C9A227] font-semibold rounded-xl hover:bg-[#C9A227] hover:text-white transition-all duration-300 w-full lg:w-auto group"
                        >
                          {expandedId === complaint.id ? 'Hide Details' : 'View Details'}
                          {expandedId === complaint.id ? 
                            <ChevronUp className="h-5 w-5 ml-2 group-hover:transform group-hover:-translate-y-1 transition-transform" /> : 
                            <ChevronDown className="h-5 w-5 ml-2 group-hover:transform group-hover:translate-y-1 transition-transform" />
                          }
                        </button>
                      </div>
                    </div>

                    {expandedId === complaint.id && (
                      <div className="mt-8 pt-6 border-t border-gray-200 animate-in slide-in-from-top duration-300">
                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100 mb-6">
                          <h4 className="font-bold mb-4 text-[#1C1C1C] text-lg flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-[#C9A227]" />
                            Full Complaint Details:
                          </h4>
                          <p className="text-[#1C1C1C] bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                            {complaint.complaint_text}
                          </p>
                        </div>
                        
                        <h4 className="font-bold mb-4 text-[#1C1C1C] text-lg flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-[#C9A227]" />
                          AI Recommended Sections:
                        </h4>
                        <div className="space-y-4">
                          {complaint.recommended_sections.map((section, index) => (
                            <div 
                              key={index} 
                              className="p-6 bg-gradient-to-br from-[#C9A227]/5 to-[#C9A227]/10 border-2 border-[#C9A227]/20 rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                              <h5 className="font-bold text-[#1C1C1C] text-lg mb-2">
                                Section {section.section_number}: {section.title}
                              </h5>
                              <p className="text-[#7A7A7A] mb-4 leading-relaxed">
                                {section.short_description}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#C9A227]/20">
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <span className="font-semibold text-[#1C1C1C]">Punishment: </span>
                                  <span className="text-[#7A7A7A]">{section.punishment}</span>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <span className="font-semibold text-[#1C1C1C]">Bailability: </span>
                                  <span className="text-[#7A7A7A]">{section.bailability_status}</span>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <span className="font-semibold text-[#1C1C1C]">Court: </span>
                                  <span className="text-[#7A7A7A]">{section.court_jurisdiction}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Load More Button */}
                {visibleCount < filteredComplaints.length && (
                  <div className="text-center mt-8 pt-8 border-t border-gray-200">
                    <button 
                      onClick={handleLoadMore} 
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#C9A227] to-[#D4B332] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Load More Complaints
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;