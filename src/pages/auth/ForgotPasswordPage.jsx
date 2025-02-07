import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMail, IconArrowLeft } from '@tabler/icons-react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

/**
 * ForgotPasswordPage component for handling password reset requests
 */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        email
      });

      setSuccess(true);
      showToast('Password reset instructions sent to your email', 'success');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
      showToast(error.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
        <div>
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you instructions to reset your
            password.
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
              <IconMail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              Check your email
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We've sent password reset instructions to your email address.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSuccess(false)}
            >
              Try again
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="Enter your email"
              error={error}
              required
              startIcon={<IconMail className="w-5 h-5" />}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
            >
              Send Reset Instructions
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
