import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  registerUser, 
  loginUser, 
  sendOTP, 
  verifyOTP, 
  checkEmailPhone 
} from '../services/userService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      userRole: null, // This will now only ever be 'user' or null
      
      // Loading states
      isLoading: false,
      isVerifyingOTP: false,
      
      // Login
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const result = await loginUser(email, password);
          
          if (result.success) {
            if (!result.data || !result.data.user || !result.data.access) {
              throw new Error('Invalid response from server');
            }
            
            localStorage.setItem('access_token', result.data.access);
            localStorage.setItem('refresh_token', result.data.refresh);
            
            const user = {
              id: result.data.user.id,
              first_name: result.data.user.first_name,
              name: `${result.data.user.first_name} ${result.data.user.last_name}`,
              email: result.data.user.email,
              phone_number: result.data.user.phone_number,
              role: 'user', // Role is now hardcoded to 'user'
            };
            
            set({
              user,
              isAuthenticated: true,
              userRole: 'user', // Role is now hardcoded to 'user'
              isLoading: false,
            });
            return { success: true };
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          console.error('Login error in store:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      // Register
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const result = await registerUser(userData);
          
          if (result.success) {
            if (!result.data || !result.data.user || !result.data.access) {
              throw new Error('Invalid response from server');
            }
            
            localStorage.setItem('access_token', result.data.access);
            localStorage.setItem('refresh_token', result.data.refresh);
            
            const user = {
              id: result.data.user.id,
              first_name: result.data.user.first_name,
              name: `${result.data.user.first_name} ${result.data.user.last_name}`,
              email: result.data.user.email,
              phone_number: result.data.user.phone_number,
              role: 'user', // Role is now hardcoded to 'user'
            };
            
            set({
              user,
              isAuthenticated: true,
              userRole: 'user', // Role is now hardcoded to 'user'
              isLoading: false,
            });
            return { success: true };
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          console.error('Registration error in store:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      // Send OTP
      sendOTP: async (email) => {
        set({ isVerifyingOTP: true });
        try {
          const result = await sendOTP(email);
          set({ isVerifyingOTP: false });
          return result;
        } catch (error) {
          set({ isVerifyingOTP: false });
          return { success: false, error: error.message };
        }
      },
      
      // Verify OTP
      verifyOTP: async (email, otp) => {
        set({ isVerifyingOTP: true });
        try {
          const result = await verifyOTP(email, otp);
          set({ isVerifyingOTP: false });
          return result;
        } catch (error) {
          set({ isVerifyingOTP: false });
          return { success: false, error: error.message };
        }
      },
      
      // Logout
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          isAuthenticated: false,
          userRole: null,
          isLoading: false,
          isVerifyingOTP: false,
        });
      },
      
      // Check email and phone availability
      checkEmailPhone: async (email, phone) => {
        try {
          const result = await checkEmailPhone(email, phone);
          return result;
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      
      // Check if user is already authenticated
      checkAuth: () => {
        const token = localStorage.getItem('access_token');
        const user = get().user;
        
        if (token && user) {
          set({ isAuthenticated: true, userRole: 'user' });
          return true;
        }
        return false;
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

export default useAuthStore;
