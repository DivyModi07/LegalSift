import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      userRole: null, // 'user', 'admin', 'lawyer'
      
      // Loading states
      isLoading: false,
      isVerifyingOTP: false,
      
      // Login
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // Mock API call - replace with actual API
          const response = await mockLoginAPI(email, password);
          set({
            user: response.user,
            isAuthenticated: true,
            userRole: response.user.role,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Register
      register: async (userData) => {
        set({ isLoading: true });
        try {
          // Mock API call - replace with actual API
          const response = await mockRegisterAPI(userData);
          set({
            user: response.user,
            isAuthenticated: true,
            userRole: response.user.role,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Send OTP
      sendOTP: async (email) => {
        set({ isVerifyingOTP: true });
        try {
          // Mock API call - replace with actual API
          await mockSendOTPAPI(email);
          set({ isVerifyingOTP: false });
          return { success: true };
        } catch (error) {
          set({ isVerifyingOTP: false });
          return { success: false, error: error.message };
        }
      },
      
      // Verify OTP
      verifyOTP: async (email, otp) => {
        set({ isVerifyingOTP: true });
        try {
          // Mock API call - replace with actual API
          const response = await mockVerifyOTPAPI(email, otp);
          set({ isVerifyingOTP: false });
          return { success: true, user: response.user };
        } catch (error) {
          set({ isVerifyingOTP: false });
          return { success: false, error: error.message };
        }
      },
      
      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          userRole: null,
          isLoading: false,
          isVerifyingOTP: false,
        });
      },
      
      // Update user profile
      updateProfile: (updatedData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedData },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
      }),
    }
  )
);

// Mock API functions - replace with actual API calls
const mockLoginAPI = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data
  const mockUsers = {
    'user@example.com': {
      id: 1,
      name: 'John Doe',
      email: 'user@example.com',
      phone: '+91 9876543210',
      role: 'user',
    },
    'admin@example.com': {
      id: 2,
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '+91 9876543211',
      role: 'admin',
    },
  };
  
  if (mockUsers[email] && password === 'password') {
    return { user: mockUsers[email] };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegisterAPI = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user: {
      id: Date.now(),
      ...userData,
      role: 'user',
    },
  };
};

const mockSendOTPAPI = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In real app, this would send OTP to email
  console.log(`OTP sent to ${email}`);
};

const mockVerifyOTPAPI = async (email, otp) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock OTP verification (any 6-digit number works)
  if (otp.length === 6 && /^\d+$/.test(otp)) {
    return {
      user: {
        id: Date.now(),
        email,
        role: 'user',
      },
    };
  }
  
  throw new Error('Invalid OTP');
};

export default useAuthStore;
