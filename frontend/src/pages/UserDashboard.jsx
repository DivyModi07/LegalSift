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
      case 'high': return 'bg-error/10 text-error';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-neutral-100 text-neutral-600';
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8">
        {/* Header and Quick Actions */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.first_name || 'User'}!
          </h1>
          <p className="text-neutral-600">
            Manage your complaints and get legal assistance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link to="/submit-complaint" className="card p-6 hover:shadow-medium transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg"><Plus className="h-6 w-6 text-primary-600" /></div>
                    <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Submit New Complaint</h3>
                <p className="text-neutral-600 text-sm">Get instant AI analysis of your legal issue.</p>
            </Link>
            <Link to="/ipc-explorer" className="card p-6 hover:shadow-medium transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg"><Search className="h-6 w-6 text-primary-600" /></div>
                    <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Explore IPC Sections</h3>
                <p className="text-neutral-600 text-sm">Search and understand the Indian Penal Code.</p>
            </Link>
            <Link to="/chatbot" className="card p-6 hover:shadow-medium transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg"><MessageSquare className="h-6 w-6 text-primary-600" /></div>
                    <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Legal Assistant</h3>
                <p className="text-neutral-600 text-sm">Get instant answers to your legal questions.</p>
            </Link>
        </div>

        {/* Complaints Section */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your Complaints</h2>
              <p className="text-neutral-600">Track the status and details of your submitted complaints.</p>
            </div>
            <div className="relative mt-4 md:mt-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {searchTerm ? 'No Complaints Found' : 'No Complaints Yet'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {searchTerm ? 'Try a different search term.' : 'Submit your first complaint to get started.'}
              </p>
              {!searchTerm && <Link to="/submit-complaint" className="btn btn-primary">Submit Complaint</Link>}
            </div>
          ) : (
            <div className="space-y-4">
              {complaintsToShow.map((complaint) => (
                <div key={complaint.id} className="border border-neutral-200 rounded-lg p-6 hover:shadow-soft transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-neutral-900">{complaint.predicted_category}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(complaint.predicted_urgency)}`}>
                            {getUrgencyIcon(complaint.predicted_urgency)}
                            <span className="ml-1 capitalize">{complaint.predicted_urgency}</span>
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                            <CheckCircle className="h-3 w-3 mr-1" /> Analyzed
                          </span>
                        </div>
                      </div>
                      <p className="text-neutral-600 mb-4 line-clamp-2">{complaint.complaint_text}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                        <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{complaint.city}, {complaint.state}</div>
                        <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{new Date(complaint.created_at).toLocaleDateString()}</div>
                        {complaint.recommended_sections?.[0] && (
                          <div className="flex items-center"><Shield className="h-4 w-4 mr-1" />Top Section: {complaint.recommended_sections[0].section_number}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-4 lg:mt-0">
                      <button onClick={() => toggleDetails(complaint.id)} className="btn btn-secondary text-sm w-full lg:w-auto">
                        {expandedId === complaint.id ? 'Hide Details' : 'View Details'}
                        {expandedId === complaint.id ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                      </button>
                    </div>
                  </div>

                  {expandedId === complaint.id && (
                    <div className="mt-6 pt-4 border-t border-neutral-200">
                      <h4 className="font-semibold mb-2 text-neutral-800">Full Complaint Details:</h4>
                      <p className="text-neutral-700 bg-neutral-50 p-3 rounded-lg text-sm">{complaint.complaint_text}</p>
                      
                      <h4 className="font-semibold mt-4 mb-2 text-neutral-800">AI Recommended Sections:</h4>
                      <div className="space-y-3">
                        {complaint.recommended_sections.map((section, index) => (
                          <div key={index} className="p-3 bg-primary-50 border border-primary-100 rounded-lg">
                            <p className="font-semibold text-primary-800">Section {section.section_number}: {section.title}</p>
                            <p className="text-sm text-primary-700 mt-1">{section.short_description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 pt-3 border-t border-primary-200 text-xs">
                                <div><span className="font-medium text-primary-900">Punishment: </span>{section.punishment}</div>
                                <div><span className="font-medium text-primary-900">Bailability: </span>{section.bailability_status}</div>
                                <div><span className="font-medium text-primary-900">Court: </span>{section.court_jurisdiction}</div>
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
                <div className="text-center mt-6">
                  <button onClick={handleLoadMore} className="btn btn-primary">
                    Load More Complaints
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;