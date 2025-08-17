import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockStats = {
      totalComplaints: 1247,
      pendingComplaints: 89,
      analyzedComplaints: 1158,
      totalUsers: 856,
      totalLawyers: 45,
      pendingApplications: 12,
      approvedLawyers: 33,
      complaintsByCategory: {
        'Fraud': 234,
        'Theft': 189,
        'Harassment': 156,
        'Property': 123,
        'Cyber Crime': 98,
        'Other': 447
      },
      complaintsByState: {
        'Maharashtra': 234,
        'Delhi': 189,
        'Karnataka': 156,
        'Tamil Nadu': 123,
        'Gujarat': 98,
        'Others': 447
      },
      complaintsByMonth: {
        'Jan': 89,
        'Feb': 102,
        'Mar': 134,
        'Apr': 156,
        'May': 178,
        'Jun': 201
      },
      urgencyDistribution: {
        'High': 234,
        'Medium': 456,
        'Low': 557
      }
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

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
            Analytics Dashboard
          </h1>
          <p className="text-neutral-600">
            Comprehensive insights and statistics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              {stats.totalComplaints?.toLocaleString()}
            </h3>
            <p className="text-neutral-600">Total Complaints</p>
            <div className="mt-2 text-sm text-neutral-500">
              {stats.analyzedComplaints} analyzed • {stats.pendingComplaints} pending
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-success/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              {stats.totalUsers?.toLocaleString()}
            </h3>
            <p className="text-neutral-600">Registered Users</p>
            <div className="mt-2 text-sm text-neutral-500">
              Active users this month
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-warning/10 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              {stats.pendingComplaints}
            </h3>
            <p className="text-neutral-600">Pending Analysis</p>
            <div className="mt-2 text-sm text-neutral-500">
              Require immediate attention
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              {stats.totalLawyers}
            </h3>
            <p className="text-neutral-600">Total Lawyers</p>
            <div className="mt-2 text-sm text-neutral-500">
              {stats.approvedLawyers} approved • {stats.pendingApplications} pending
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Complaints by Category */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Complaints by Category
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.complaintsByCategory || {}).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-neutral-700">{category}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalComplaints) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaints by State */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Complaints by State
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.complaintsByState || {}).map(([state, count]) => (
                <div key={state} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-700">{state}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalComplaints) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Monthly Complaint Trends
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {Object.entries(stats.complaintsByMonth || {}).map(([month, count]) => (
              <div key={month} className="text-center">
                <div className="bg-primary-100 rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold text-primary-600">{count}</div>
                </div>
                <div className="text-sm text-neutral-600">{month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Distribution */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="bg-error/10 p-4 rounded-lg mb-4">
              <AlertTriangle className="h-8 w-8 text-error mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              {stats.urgencyDistribution?.High || 0}
            </h3>
            <p className="text-neutral-600">High Urgency</p>
            <div className="mt-2 text-sm text-neutral-500">
              Require immediate action
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-warning/10 p-4 rounded-lg mb-4">
              <Clock className="h-8 w-8 text-warning mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              {stats.urgencyDistribution?.Medium || 0}
            </h3>
            <p className="text-neutral-600">Medium Urgency</p>
            <div className="mt-2 text-sm text-neutral-500">
              Standard processing time
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-success/10 p-4 rounded-lg mb-4">
              <CheckCircle className="h-8 w-8 text-success mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-1">
              {stats.urgencyDistribution?.Low || 0}
            </h3>
            <p className="text-neutral-600">Low Urgency</p>
            <div className="mt-2 text-sm text-neutral-500">
              Routine processing
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              System Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">AI Analysis Accuracy</span>
                <span className="font-semibold text-success">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Average Response Time</span>
                <span className="font-semibold text-neutral-900">2.3s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">System Uptime</span>
                <span className="font-semibold text-success">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">User Satisfaction</span>
                <span className="font-semibold text-success">4.8/5</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-neutral-600">15 complaints analyzed in the last hour</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-neutral-600">3 new user registrations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-neutral-600">2 lawyer applications received</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-neutral-600">System backup completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
