// frontend/src/services/complaintService.js

import api from './api';

const COMPLAINT_API_URL = '/complaints/';

const submitComplaintForAnalysis = async (complaintText, dateOfIncident) => {
  const response = await api.post(`${COMPLAINT_API_URL}analyze/`, {
    complaint_text: complaintText,
    date_of_incident: dateOfIncident, // Add the new field
  });
  return response.data;
};

const complaintService = {
  submitComplaintForAnalysis,
};

export default complaintService;