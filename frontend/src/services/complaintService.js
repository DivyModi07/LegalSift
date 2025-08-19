import api from './api';

const COMPLAINT_API_URL = '/complaints/';

/**
 * Submits the full complaint details for analysis and storage.
 * @param {object} complaintData - The complete form data.
 * @returns {Promise<any>} The analysis result from the backend.
 */
const submitComplaintForAnalysis = async (complaintData) => {
  const payload = {
    state: complaintData.state,
    city: complaintData.city,
    dateOfIncident: complaintData.dateOfIncident,
    complaint_text: complaintData.complaint,
  };
  const response = await api.post(`${COMPLAINT_API_URL}analyze/`, payload);
  return response.data;
};

/**
 * Fetches the complaint history for the currently logged-in user.
 * @returns {Promise<any>} A list of past complaints.
 */
const getComplaintHistory = async () => {
  try {
    const response = await api.get(`${COMPLAINT_API_URL}history/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint history:', error.response?.data || error.message);
    throw error;
  }
};

const complaintService = {
  submitComplaintForAnalysis,
  getComplaintHistory, // Add the new function here
};

export default complaintService;