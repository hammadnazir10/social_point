import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

/**
 * EditTopicPage component for editing existing topics
 * Features:
 * - Load existing topic data
 * - Edit title, description, and hashtags
 * - Form validation
 * - Success/error handling
 */
const EditTopicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hashtags: []
  });
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/topics/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const topic = response.data.data;
      
      // Check if user is the owner of the topic
      if (topic.userId._id !== user?.id) {
        showToast('You are not authorized to edit this topic', 'error');
        navigate(-1);
        return;
      }

      setFormData({
        title: topic.title,
        description: topic.description,
        hashtags: topic.hashtags || []
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Error fetching topic',
        'error'
      );
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
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
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/topics/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('Topic updated successfully', 'success');
      navigate(`/topic/${id}`);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Error updating topic',
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

  const handleHashtagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      if (currentHashtag.trim() && !formData.hashtags.includes(currentHashtag.trim())) {
        setFormData(prev => ({
          ...prev,
          hashtags: [...prev.hashtags, currentHashtag.trim()]
        }));
      }
      setCurrentHashtag('');
    } else if (e.key === 'Backspace' && !currentHashtag) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        hashtags: prev.hashtags.slice(0, -1)
      }));
    }
  };

  const removeHashtag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

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
          Edit Topic
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            label="Title"
            placeholder="Enter a descriptive title"
            error={errors.title}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your topic in detail..."
              rows={6}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`}
              required
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Hashtags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeHashtag(tag)}
                    className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={currentHashtag}
              onChange={(e) => setCurrentHashtag(e.target.value)}
              onKeyDown={handleHashtagKeyDown}
              placeholder="Add hashtags (press Enter or Space to add)"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
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
              Update Topic
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTopicPage;
