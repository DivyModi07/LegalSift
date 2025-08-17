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
      userRole: null, // 'user', 'admin', 'lawyer'
      
      // Loading states
      isLoading: false,
      isVerifyingOTP: false,
      
      // Login
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          console.log('Attempting login with email:', email);
          const result = await loginUser(email, password);
          console.log('Login result:', result);
          
          if (result.success) {
            console.log('Login successful, data:', result.data);
            
            // Check if we have the expected data structure
            if (!result.data || !result.data.user || !result.data.access) {
              console.error('Invalid login response structure:', result.data);
              set({ isLoading: false });
              return { success: false, error: 'Invalid response from server' };
            }
            
            // Store tokens
            localStorage.setItem('access_token', result.data.access);
            localStorage.setItem('refresh_token', result.data.refresh);
            
            // Set user data
            const user = {
              id: result.data.user.id,
              name: `${result.data.user.first_name} ${result.data.user.last_name}`,
              email: result.data.user.email,
              role: result.data.user.role || 'user', // Use role from backend or default to 'user'
            };
            
            console.log('Setting user data:', user);
            
            set({
              user,
              isAuthenticated: true,
              userRole: user.role,
              isLoading: false,
            });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          console.error('Login error in store:', error);
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Register
      register: async (userData) => {
        set({ isLoading: true });
        try {
          console.log('Attempting registration with data:', userData);
          const result = await registerUser(userData);
          console.log('Registration result:', result);
          
          if (result.success) {
            console.log('Registration successful, data:', result.data);
            
            // Check if we have the expected data structure
            if (!result.data || !result.data.user || !result.data.access) {
              console.error('Invalid response structure:', result.data);
              set({ isLoading: false });
              return { success: false, error: 'Invalid response from server' };
            }
            
            // Store tokens
            localStorage.setItem('access_token', result.data.access);
            localStorage.setItem('refresh_token', result.data.refresh);
            
            // Set user data
            const user = {
              id: result.data.user.id,
              name: `${result.data.user.first_name} ${result.data.user.last_name}`,
              email: result.data.user.email,
              role: result.data.user.role || 'user', // Use role from backend or default to 'user'
            };
            
            console.log('Setting user data:', user);
            
            set({
              user,
              isAuthenticated: true,
              userRole: user.role,
              isLoading: false,
            });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          console.error('Registration error in store:', error);
          set({ isLoading: false });
          return { success: false, error: error.message };
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
        // Clear tokens from localStorage
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
      
      // Update user profile
      updateProfile: (updatedData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedData },
          });
        }
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
      
      // Check if user is already authenticated (for page refreshes)
      checkAuth: () => {
        const token = localStorage.getItem('access_token');
        const user = get().user;
        
        if (token && user) {
          set({ isAuthenticated: true, userRole: user.role });
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
