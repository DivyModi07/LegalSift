import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  MapPin,
  Calendar,
  User
} from 'lucide-react';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockComplaints = [
      {
        id: 1,
        title: 'Online Fraud Complaint',
        user: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        status: 'analyzed',
        urgency: 'high',
        category: 'Fraud',
        section: '420',
        createdAt: '2024-01-20T10:30:00Z',
        state: 'Maharashtra',
        city: 'Mumbai',
        description: 'I was scammed by an online seller who took my money but never delivered the product.',
        analysis: {
          section: '420',
          title: 'Cheating and Dishonestly Inducing Delivery of Property',
          punishment: 'Imprisonment up to 7 years and fine',
          bailable: 'Non-bailable',
          recommendation: 'Contact nearest police station immediately'
        }
      },
      {
        id: 2,
        title: 'Property Dispute',
        user: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        status: 'pending',
        urgency: 'medium',
        category: 'Property',
        section: '447',
        createdAt: '2024-01-20T09:15:00Z',
        state: 'Delhi',
        city: 'New Delhi',
        description: 'Neighbor is encroaching on my property boundary.',
        analysis: null
      },
      {
        id: 3,
        title: 'Workplace Harassment',
        user: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+91 9876543212',
        status: 'analyzed',
        urgency: 'high',
        category: 'Harassment',
        section: '354',
        createdAt: '2024-01-20T08:45:00Z',
        state: 'Karnataka',
        city: 'Bangalore',
        description: 'Facing harassment from colleagues at workplace.',
        analysis: {
          section: '354',
          title: 'Assault or Criminal Force to Woman with Intent to Outrage her Modesty',
          punishment: 'Imprisonment up to 2 years, or fine, or both',
          bailable: 'Bailable',
          recommendation: 'Contact nearest police station immediately'
        }
      }
    ];

    setTimeout(() => {
      setComplaints(mockComplaints);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesUrgency = filterUrgency === 'all' || complaint.urgency === filterUrgency;
    return matchesSearch && matchesStatus && matchesUrgency;
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
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Complaint Management
          </h1>
          <p className="text-neutral-600">
            View and manage all submitted complaints
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search complaints by title, user, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-neutral-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input w-full lg:w-40"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="analyzed">Analyzed</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="form-input w-full lg:w-40"
              >
                <option value="all">All Urgency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <div className="card p-12 text-center">
              <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No complaints found
              </h3>
              <p className="text-neutral-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Complaints ({filteredComplaints.length})
                </h2>
              </div>
              
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="card p-6">
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
                        
                        <p className="text-neutral-600 mb-4">
                          {complaint.description}
                        </p>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-neutral-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {complaint.user}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {complaint.city}, {complaint.state}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            IPC Section {complaint.section}
                          </div>
                        </div>

                        {/* Analysis Result */}
                        {complaint.analysis && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">AI Analysis Result</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-green-700 font-medium">Section:</span> {complaint.analysis.section}
                              </div>
                              <div>
                                <span className="text-green-700 font-medium">Punishment:</span> {complaint.analysis.punishment}
                              </div>
                              <div>
                                <span className="text-green-700 font-medium">Bailable:</span> {complaint.analysis.bailable}
                              </div>
                              <div>
                                <span className="text-green-700 font-medium">Recommendation:</span> {complaint.analysis.recommendation}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button className="btn btn-secondary text-sm inline-flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        {complaint.status === 'pending' && (
                          <button className="btn btn-primary text-sm">
                            Analyze
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;
