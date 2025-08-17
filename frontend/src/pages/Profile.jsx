import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  Edit, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Password validation only if changing password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Update profile data
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      updateProfile(updateData);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Profile Settings
              </h1>
              <p className="text-neutral-600">
                Manage your account information and preferences
              </p>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary inline-flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Personal Information
                </h3>
                
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${errors.name ? 'border-error' : ''} ${!isEditing ? 'bg-neutral-50' : ''}`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && (
                    <p className="form-error">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${errors.email ? 'border-error' : ''} ${!isEditing ? 'bg-neutral-50' : ''}`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="form-error">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      disabled={!isEditing}
                      className={`form-input pl-10 ${errors.phone ? 'border-error' : ''} ${!isEditing ? 'bg-neutral-50' : ''}`}
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && (
                    <p className="form-error">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Change Password */}
              {isEditing && (
                <div className="space-y-4 pt-6 border-t border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Change Password
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Leave password fields empty if you don't want to change your password.
                  </p>
                  
                  <div>
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        className={`form-input pl-10 ${errors.currentPassword ? 'border-error' : ''}`}
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.currentPassword && (
                      <p className="form-error">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        className={`form-input pl-10 pr-10 ${errors.newPassword ? 'border-error' : ''}`}
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-neutral-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-neutral-400" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="form-error">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        className={`form-input pl-10 ${errors.confirmPassword ? 'border-error' : ''}`}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="form-error">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4 pt-6 border-t border-neutral-200">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 inline-flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Profile;
