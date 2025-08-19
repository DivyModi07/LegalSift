import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, ChevronDown, ChevronUp, AlertTriangle, Clock, CheckCircle, Loader } from 'lucide-react';
import complaintService from '../services/complaintService';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await complaintService.getComplaintHistory();
        setComplaints(data);
      } catch (error) {
        toast.error('Could not fetch complaint history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-4 text-neutral-600">Loading Complaint History...</p>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-neutral-400" />
        <h3 className="mt-4 text-lg font-semibold text-neutral-900">No Complaints Found</h3>
        <p className="mt-1 text-neutral-600">You have not submitted any complaints yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <div key={complaint.id} className="card p-4">
          {/* This is the restored multi-column layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            {/* Date */}
            <div className="text-sm">
              <p className="font-semibold text-neutral-900">
                {new Date(complaint.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
              <p className="text-neutral-500">Filed On</p>
            </div>

            {/* Category */}
            <div className="text-sm">
              <p className="font-semibold text-neutral-900">{complaint.predicted_category}</p>
              <p className="text-neutral-500">Category</p>
            </div>

            {/* Urgency */}
            <div className="text-sm">
              <div className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getUrgencyColor(complaint.predicted_urgency)}`}>
                {getUrgencyIcon(complaint.predicted_urgency)}
                <span className="ml-1 capitalize">{complaint.predicted_urgency}</span>
              </div>
            </div>

            {/* Toggle Button */}
            <div className="text-right">
              <button
                onClick={() => toggleDetails(complaint.id)}
                className="btn btn-secondary py-2"
              >
                {expandedId === complaint.id ? 'Hide' : 'Details'}
                {expandedId === complaint.id ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === complaint.id && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2 text-neutral-800">Full Complaint Details:</h4>
              <p className="text-neutral-700 bg-neutral-50 p-3 rounded-lg text-sm">{complaint.complaint_text}</p>
              
              <h4 className="font-semibold mt-4 mb-2 text-neutral-800">AI Recommended Sections:</h4>
              <div className="space-y-3">
                {complaint.recommended_sections.map((section, index) => (
                  <div key={index} className="p-3 bg-primary-50 border border-primary-100 rounded-lg">
                    <p className="font-semibold text-primary-800">Section {section.section_number}: {section.title}</p>
                    <p className="text-sm text-primary-700 mt-1">{section.short_description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComplaintHistory;