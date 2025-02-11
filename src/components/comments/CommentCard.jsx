import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IconThumbUp,
  IconThumbDown,
  IconTrash,
  IconEdit,
  IconMessageCircle2,
} from "@tabler/icons-react";
import { getAnonymousUserId } from "@/hooks/anonymousUser";
import { useToast } from "@/hooks/useToast";
import axios from "axios";
import Avatar from "@/components/common/Avatar";
import ReplyForm from "./ReplyForm";

const CommentCard = ({
  comment,
  onDelete,
  onUpdate,
  topicId,
  onReply,
  showReplyForm = true,
}) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("token")
    ? localStorage.getItem("userId")
    : getAnonymousUserId();
  const isOwner = userId === comment.userId?._id;

  const handleVote = async (voteType, commentId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments/${commentId}/vote`,
        { voteType, userId }
      );
  
      onUpdate(response.data.data); // Update UI with new data
    } catch (error) {
      showToast(
        error.response?.data?.message || "Error voting on comment",
        "error"
      );
    }
  };
  

  const handleEdit = async () => {
    if (!editedContent.trim()) {
      showToast("Comment cannot be empty", "error");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}`,
        { content: editedContent, userId }
      );
      onUpdate(response.data.data);
      setIsEditing(false);
      showToast("Comment updated successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Error updating comment",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/comments/${comment._id}`,
        { data: { userId } }
      );
      onDelete(comment._id);
      showToast("Comment deleted successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Error deleting comment",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = (replyContent) => {
    onReply(comment._id, replyContent);
    setIsReplyFormOpen(false);
  };

  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border">
      <div className="flex items-start space-x-4">
        <Avatar
          src={comment.userId?.profilePicture}
          alt={comment.userId?.username}
          size="sm"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${comment.userId?._id}`}
              className="font-medium text-gray-900"
            >
              {comment.userId?.username || "Anonymous"}
            </Link>
            {isOwner && (
              <div className="flex space-x-2">
                <button onClick={() => setIsEditing(!isEditing)}>
                  <IconEdit className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} disabled={isLoading}>
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          ) : (
            <audio controls className="w-full mt-2">
              <source src={comment.audioUrl} type="audio/mpeg" />
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
            onClick={() => handleVote("like", comment._id)}
            className={`flex items-center space-x-1 ${
              comment.likedBy?.includes(userId) ? "text-blue-600" : "text-gray-500"
            } hover:text-blue-600`}
          >
            <IconThumbUp className="w-4 h-4" />
            <span>{comment.likes || 0}</span>
          </button>
          <button
            onClick={() => handleVote("dislike", comment._id)}
            className={`flex items-center space-x-1 ${
              comment.dislikedBy?.includes(userId) ? "text-red-600" : "text-gray-500"
            } hover:text-red-600`}
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
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={toggleReplies}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <IconMessageCircle2 className="w-4 h-4" />
                <span>Replies ({comment.replies.length})</span>
              </button>
            )}
          </div>

          {isReplyFormOpen && (
            <ReplyForm
              onSubmit={handleReplySubmit}
              parentCommentId={comment._id}
              topicId={topicId}
            />
          )}

          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
              <CommentCard
                key={reply._id}
                comment={reply}
                topicId={topicId}
                onDelete={onDelete}
                onUpdate={onUpdate}
                showReplyForm={false}
              />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;