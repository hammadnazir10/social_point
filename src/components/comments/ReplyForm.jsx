import { useState } from 'react';
import Button from '@/components/common/Button';

/**
 * ReplyForm component for submitting replies to comments
 * @param {Object} props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 */
const ReplyForm = ({ onSubmit, onCancel }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        className="w-full min-h-[100px] p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
        maxLength={500}
      />

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!content.trim()}
        >
          Reply
        </Button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
        {content.length}/500 characters
      </div>
    </form>
  );
};

export default ReplyForm;