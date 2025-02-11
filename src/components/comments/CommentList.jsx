import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

const CommentList = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const { showToast } = useToast();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/comments/topic/${topicId}`
      );

      const commentsWithReplies = await Promise.all(
        response.data.data.map(async (comment) => {
          const repliesResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}/replies`
          );
          return { ...comment, replies: repliesResponse.data.data };
        })
      );

      const sortedComments = commentsWithReplies.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

      setComments(sortedComments);
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Error fetching comments',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [topicId, sortOrder]);

  const handleCommentSubmit = (newComment) => {
    setComments((prevComments) => [
      sortOrder === 'desc' ? newComment : [...prevComments, newComment],
    ]);
  };

  const handleCommentDelete = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  const handleCommentUpdate = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleReply = (parentCommentId, replyContent) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === parentCommentId
          ? { ...comment, replies: [...(comment.replies || []), replyContent] }
          : comment
      )
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="space-y-6">
      <CommentForm topicId={topicId} onCommentSubmit={handleCommentSubmit} />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comments ({comments.length})
        </h3>
        <button
          onClick={toggleSortOrder}
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {sortOrder === 'asc' ? (
            <>
              <IconSortAscending className="w-5 h-5" />
              <span>Oldest first</span>
            </>
          ) : (
            <>
              <IconSortDescending className="w-5 h-5" />
              <span>Newest first</span>
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-4 border p-[15px] rounded-lg">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              topicId={topicId}
              onDelete={handleCommentDelete}
              onUpdate={handleCommentUpdate}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;