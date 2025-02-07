import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconUser, IconMail, IconLock } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

/**
 * RegisterPage component for user registration
 * Handles new user account creation with username, email, and password
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      showToast('Registration successful! Please log in.', 'success');
      navigate('/login');
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Registration failed. Please try again.',
        'error'
      );
      setErrors({
        ...errors,
        submit: error.response?.data?.message || 'Registration failed. Please try again.'
      });
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our community and start discussing
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              label="Username"
              placeholder="Choose a username"
              error={errors.username}
              required
              startIcon={<IconUser className="w-5 h-5" />}
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
              startIcon={<IconMail className="w-5 h-5" />}
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
              placeholder="Create a password"
              error={errors.password}
              required
              startIcon={<IconLock className="w-5 h-5" />}
              showPasswordToggle
              helperText="Must be at least 6 characters"
            />

            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
              startIcon={<IconLock className="w-5 h-5" />}
              showPasswordToggle
            />
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600 dark:text-red-500 mt-2">
              {errors.submit}
            </p>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{' '}
            <Link
              to="/terms"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
