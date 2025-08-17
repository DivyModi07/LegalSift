import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  X,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Award
} from 'lucide-react';

const AdminLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLawyers = [
      {
        id: 1,
        name: 'Adv. Rajesh Kumar',
        email: 'rajesh.kumar@law.com',
        phone: '+91 9876543210',
        status: 'approved',
        specialization: 'Criminal Law',
        experience: '15 years',
        barCouncilNumber: 'MHC/12345/2010',
        state: 'Maharashtra',
        city: 'Mumbai',
        fees: '₹5,000',
        practiceAreas: ['Criminal Law', 'Civil Law', 'Family Law'],
        education: 'LLB from National Law School, Bangalore',
        description: 'Experienced criminal lawyer with expertise in white-collar crimes and cyber law.',
        appliedAt: '2024-01-15T10:30:00Z',
        approvedAt: '2024-01-18T14:20:00Z'
      },
      {
        id: 2,
        name: 'Adv. Priya Sharma',
        email: 'priya.sharma@law.com',
        phone: '+91 9876543211',
        status: 'approved',
        specialization: 'Corporate Law',
        experience: '12 years',
        barCouncilNumber: 'DHC/67890/2012',
        state: 'Delhi',
        city: 'New Delhi',
        fees: '₹4,500',
        practiceAreas: ['Corporate Law', 'Tax Law', 'Intellectual Property'],
        education: 'LLB from Delhi University, LLM from Harvard Law School',
        description: 'Specialized in corporate law with focus on mergers and acquisitions.',
        appliedAt: '2024-01-10T09:15:00Z',
        approvedAt: '2024-01-12T16:45:00Z'
      },
      {
        id: 3,
        name: 'Adv. Amit Patel',
        email: 'amit.patel@law.com',
        phone: '+91 9876543212',
        status: 'pending',
        specialization: 'Property Law',
        experience: '8 years',
        barCouncilNumber: 'GHC/11111/2016',
        state: 'Gujarat',
        city: 'Ahmedabad',
        fees: '₹3,500',
        practiceAreas: ['Property Law', 'Real Estate Law', 'Civil Law'],
        education: 'LLB from Gujarat University',
        description: 'Expert in property disputes and real estate transactions.',
        appliedAt: '2024-01-20T11:00:00Z',
        approvedAt: null
      },
      {
        id: 4,
        name: 'Adv. Kavita Reddy',
        email: 'kavita.reddy@law.com',
        phone: '+91 9876543213',
        status: 'rejected',
        specialization: 'Family Law',
        experience: '6 years',
        barCouncilNumber: 'KHC/22222/2018',
        state: 'Karnataka',
        city: 'Bangalore',
        fees: '₹3,000',
        practiceAreas: ['Family Law', 'Divorce Law', 'Child Custody'],
        education: 'LLB from Bangalore University',
        description: 'Specialized in family law and divorce proceedings.',
        appliedAt: '2024-01-05T08:30:00Z',
        approvedAt: null,
        rejectionReason: 'Incomplete documentation'
      }
    ];

    setTimeout(() => {
      setLawyers(mockLawyers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lawyer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'pending': return 'text-warning';
      case 'rejected': return 'text-error';
      default: return 'text-neutral-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleApprove = (lawyerId) => {
    // Mock approval - replace with actual API call
    setLawyers(prev => prev.map(lawyer => 
      lawyer.id === lawyerId 
        ? { ...lawyer, status: 'approved', approvedAt: new Date().toISOString() }
        : lawyer
    ));
  };

  const handleReject = (lawyerId) => {
    // Mock rejection - replace with actual API call
    setLawyers(prev => prev.map(lawyer => 
      lawyer.id === lawyerId 
        ? { ...lawyer, status: 'rejected', rejectionReason: 'Application rejected by admin' }
        : lawyer
    ));
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
            Lawyer Management
          </h1>
          <p className="text-neutral-600">
            Review and manage lawyer applications
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search lawyers by name, specialization, or city..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lawyers List */}
        <div className="space-y-6">
          {filteredLawyers.length === 0 ? (
            <div className="card p-12 text-center">
              <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No lawyers found
              </h3>
              <p className="text-neutral-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Lawyers ({filteredLawyers.length})
                </h2>
              </div>
              
              <div className="space-y-4">
                {filteredLawyers.map((lawyer) => (
                  <div key={lawyer.id} className="card p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {lawyer.name}
                            </h3>
                            <p className="text-neutral-600">{lawyer.specialization}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lawyer.status)}`}>
                              {getStatusIcon(lawyer.status)}
                              <span className="ml-1 capitalize">{lawyer.status}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-neutral-500 mb-4">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {lawyer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {lawyer.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {lawyer.city}, {lawyer.state}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2" />
                            {lawyer.experience} experience
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-neutral-600 text-sm">
                            {lawyer.description}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-neutral-700">Practice Areas:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {lawyer.practiceAreas.map((area, index) => (
                                <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-neutral-700">Consultation Fees:</span>
                            <p className="text-neutral-600">{lawyer.fees}/hour</p>
                          </div>
                        </div>

                        {lawyer.status === 'rejected' && lawyer.rejectionReason && (
                          <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                            <p className="text-sm text-error-700">
                              <span className="font-medium">Rejection Reason:</span> {lawyer.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button className="btn btn-secondary text-sm inline-flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        
                        {lawyer.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleApprove(lawyer.id)}
                              className="btn btn-success text-sm flex-1"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(lawyer.id)}
                              className="btn btn-danger text-sm flex-1"
                            >
                              Reject
                            </button>
                          </div>
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

export default AdminLawyers;
