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
  Filter,
  Loader
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockComplaints = [
      {
        id: 1,
        title: 'Online Fraud Complaint',
        description: 'I was scammed by an online seller who took my money but never delivered the product.',
        status: 'analyzed',
        urgency: 'high',
        category: 'Fraud',
        section: '420',
        createdAt: '2024-01-15',
        state: 'Maharashtra',
        city: 'Mumbai',
        lawyers: [
          { name: 'Adv. Rajesh Kumar', phone: '+91 9876543210', fees: '₹5,000' },
          { name: 'Adv. Priya Sharma', phone: '+91 9876543211', fees: '₹4,500' }
        ]
      },
      {
        id: 2,
        title: 'Property Dispute',
        description: 'Neighbor is encroaching on my property boundary.',
        status: 'analyzed',
        urgency: 'medium',
        category: 'Property',
        section: '447',
        createdAt: '2024-01-10',
        state: 'Delhi',
        city: 'New Delhi'
      },
      {
        id: 3,
        title: 'Workplace Harassment',
        description: 'Facing harassment from colleagues at workplace.',
        status: 'pending',
        urgency: 'high',
        category: 'Harassment',
        section: '354',
        createdAt: '2024-01-20',
        state: 'Karnataka',
        city: 'Bangalore'
      }
    ];

    setTimeout(() => {
      setComplaints(mockComplaints);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed': return 'text-success';
      case 'pending': return 'text-warning';
      default: return 'text-neutral-600';
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-neutral-600">
            Manage your complaints and get legal assistance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/submit-complaint"
            className="card p-6 hover:shadow-medium transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Submit New Complaint
            </h3>
            <p className="text-neutral-600 text-sm">
              Get instant AI analysis of your legal issue
            </p>
          </Link>

          <Link
            to="/ipc-explorer"
            className="card p-6 hover:shadow-medium transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Search className="h-6 w-6 text-primary-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Explore IPC Sections
            </h3>
            <p className="text-neutral-600 text-sm">
              Search and understand Indian Penal Code
            </p>
          </Link>

          <Link
            to="/chatbot"
            className="card p-6 hover:shadow-medium transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Legal Assistant
            </h3>
            <p className="text-neutral-600 text-sm">
              Get instant answers to legal questions
            </p>
          </Link>
        </div>

        {/* Complaints Section */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Your Complaints
              </h2>
              <p className="text-neutral-600">
                Track the status of your submitted complaints
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input w-full sm:w-40"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="analyzed">Analyzed</option>
              </select>
            </div>
          </div>

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No complaints found
              </h3>
              <p className="text-neutral-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Submit your first complaint to get started'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link to="/submit-complaint" className="btn btn-primary">
                  Submit Complaint
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border border-neutral-200 rounded-lg p-6 hover:shadow-soft transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {complaint.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(complaint.urgency)}`}>
                            {getUrgencyIcon(complaint.urgency)}
                            <span className="ml-1 capitalize">{complaint.urgency}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                            {complaint.status === 'analyzed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {complaint.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 mb-4 line-clamp-2">
                        {complaint.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {complaint.city}, {complaint.state}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </div>
                        {complaint.category && (
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-1" />
                            {complaint.category}
                          </div>
                        )}
                        {complaint.section && (
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            IPC Section {complaint.section}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button className="btn btn-secondary text-sm">
                        View Details
                      </button>
                      
                      {complaint.status === 'analyzed' && complaint.urgency === 'high' && complaint.lawyers && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <h4 className="text-sm font-semibold text-amber-800 mb-2">
                            Recommended Lawyers
                          </h4>
                          <div className="space-y-2">
                            {complaint.lawyers.map((lawyer, index) => (
                              <div key={index} className="text-xs text-amber-700">
                                <div className="font-medium">{lawyer.name}</div>
                                <div>Phone: {lawyer.phone}</div>
                                <div>Fees: {lawyer.fees}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
