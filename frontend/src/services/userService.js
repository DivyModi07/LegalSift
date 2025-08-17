import api from './api';

// User registration
export const registerUser = async (userData) => {
  try {
    console.log('Sending registration request with data:', userData);
    const response = await api.post('/users/register/', userData);
    console.log('Registration response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error response:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data?.error || error.response?.data || 'Registration failed' 
    };
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/users/login/', { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    // Always return false for any error to trigger the notification
    return { 
      success: false, 
      error: 'Invalid email or password. Please try again.' 
    };
  }
};

// Check email and phone availability
export const checkEmailPhone = async (email, phone) => {
  try {
    const response = await api.post('/users/check-email-phone/', { 
      email, 
      phone_number: phone 
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || 'Check failed' 
    };
  }
};

// Send OTP
export const sendOTP = async (email) => {
  try {
    const response = await api.post('/users/send-otp/', { email });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || 'Failed to send OTP' 
    };
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/users/verify-otp/', { email, otp });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('OTP verification error:', error.response?.data);
    return { 
      success: false, 
      error: error.response?.data?.error || error.response?.data || 'OTP verification failed' 
    };
  }
};

// Token refresh
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/users/token/refresh/', { 
      refresh: refreshToken 
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || 'Token refresh failed' 
    };
  }
};

// Reset password
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post('/users/reset-password/', {
      email,
      new_password: newPassword
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || error.response?.data || 'Password reset failed' 
    };
  }
};
