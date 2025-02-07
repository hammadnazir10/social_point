import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconThumbUp, IconThumbDown, IconTrash, IconEdit, IconMessageCircle2 } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import Avatar from '@/components/common/Avatar';
import ReplyForm from './ReplyForm';

/**
 * CommentCard component for displaying individual voice comments with voting and reply functionality
 */
const CommentCard = ({ comment, onDelete, onUpdate, onReply, showReplyForm = true }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdate(response.data.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error voting on comment', 'error');
    }
  };

  const handleEdit = async () => {
    if (!editedContent.trim()) {
      showToast('Comment cannot be empty', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdate(response.data.data);
      setIsEditing(false);
      showToast('Comment updated successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating comment', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onDelete(comment._id);
      showToast('Comment deleted successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting comment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = (replyContent) => {
    onReply(comment._id, replyContent);
    setIsReplyFormOpen(false);
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <Avatar
          src={comment.userId?.profilePicture}
          alt={comment.userId?.username}
          size="sm"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/profile/${comment.userId?._id}`}
                className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {comment.userId?.username}
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                {formattedDate}
              </span>
            </div>
            {user?.id === comment.userId?._id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <IconEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows="3"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <audio controls className="w-full mt-2">
              <source src={comment.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {comment.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {comment.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center space-x-4 text-sm">
            <button
              onClick={() => handleVote('like')}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <IconThumbUp className="w-4 h-4" />
              <span>{comment.likes || 0}</span>
            </button>
            <button
              onClick={() => handleVote('dislike')}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <IconThumbDown className="w-4 h-4" />
              <span>{comment.dislikes || 0}</span>
            </button>
            {showReplyForm && (
              <button
                onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <IconMessageCircle2 className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {isReplyFormOpen && (
            <div className="mt-4">
              <ReplyForm onSubmit={handleReplySubmit} onCancel={() => setIsReplyFormOpen(false)} />
            </div>
          )}

          {comment.replies?.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
              </button>
              {showReplies && (
                <div className="ml-6 mt-2 space-y-4">
                  {comment.replies.map((reply) => (
                    <CommentCard
                      key={reply._id}
                      comment={reply}
                      onDelete={onDelete}
                      onUpdate={onUpdate}
                      showReplyForm={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;