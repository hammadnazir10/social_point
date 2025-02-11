import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconUpload } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Avatar from '@/components/common/Avatar';

/**
 * EditProfilePage component for editing user profile
 * Features:
 * - Update profile picture
 * - Edit username and email
 * - Change password
 * - Form validation
 */
const EditProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
      setPreviewUrl(user.profilePicture || '');
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      
      if (formData.newPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }

      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      await updateProfile(formDataToSend);
      showToast('Profile updated successfully', 'success');
      navigate('/profile');
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Error updating profile',
        'error'
      );
    } finally {
      setIsLoading(false);
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
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        leftIcon={<IconArrowLeft className="w-5 h-5" />}
        className="mb-6"
      >
        Back
      </Button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar
              src={previewUrl}
              alt={formData.username}
              size="xl"
              className="ring-4 ring-white dark:ring-gray-800"
            />
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="profilePicture"
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              >
                <IconUpload className="w-5 h-5 mr-2" />
                Change Picture
              </label>
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setProfilePicture(null);
                    setPreviewUrl(user.profilePicture || '');
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              label="Username"
              placeholder="Enter your username"
              error={errors.username}
              required
            />

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email Address"
              placeholder="Enter your email"
              error={errors.email}
              required
            />
          </div>

          {/* Change Password */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Change Password
            </h2>
            <div className="space-y-4">
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                label="Current Password"
                placeholder="Enter your current password"
                error={errors.currentPassword}
                showPasswordToggle
              />

              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                label="New Password"
                placeholder="Enter your new password"
                error={errors.newPassword}
                showPasswordToggle
              />

              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                label="Confirm New Password"
                placeholder="Confirm your new password"
                error={errors.confirmPassword}
                showPasswordToggle
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
