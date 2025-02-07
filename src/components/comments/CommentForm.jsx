import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import { IconHash, IconSend, IconMicrophone } from '@tabler/icons-react';
import Button from '@/components/common/Button';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { v4 as uuidv4 } from 'uuid';
import { getAnonymousUserId } from '@/hooks/anonymousUser';

const CommentForm = ({ topicId, onCommentSubmit }) => {
  const [hashtags, setHashtags] = useState([]);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempAudioUrl, setTempAudioUrl] = useState(null);
  const { showToast } = useToast();
  const userId = getAnonymousUserId();
  console.log(userId);
  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
  } = useAudioRecorder();

  useEffect(() => {
    if (!recordingBlob) return;

    const uploadAudio = async () => {
      try {
        setIsLoading(true);
        const uniqueFileName = `audio_${uuidv4()}_${Date.now()}.mp3`;
        const formData = new FormData();
        formData.append('fileUrl', recordingBlob, uniqueFileName);

        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/createUrlForpicture`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTempAudioUrl(response.data.response);
        showToast('Recording saved temporarily', 'success');
      } catch (error) {
        showToast(error.response?.data?.message || 'Error uploading audio', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    uploadAudio();
  }, [recordingBlob]);

  const handleSubmit = async () => {
    if (!tempAudioUrl) {
      showToast('Please record and save audio first', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments`,
        {
          topicId,
          audioUrl: tempAudioUrl,
          hashtags,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onCommentSubmit(response.data.data);
      setHashtags([]);
      setTempAudioUrl(null);
      showToast('Voice comment added successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error posting voice comment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <IconMicrophone className="w-5 h-5" />
            <span>{isRecording ? 'Save Recording' : 'Start Recording'}</span>
          </Button>

          {tempAudioUrl && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <IconSend className="w-5 h-5" />
              <span>Publish</span>
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <IconHash className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={currentHashtag}
            onChange={(e) => setCurrentHashtag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
                e.preventDefault();
                if (currentHashtag.trim() && !hashtags.includes(currentHashtag.trim())) {
                  setHashtags([...hashtags, currentHashtag.trim()]);
                }
                setCurrentHashtag('');
              } else if (e.key === 'Backspace' && !currentHashtag) {
                e.preventDefault();
                const newHashtags = [...hashtags];
                newHashtags.pop();
                setHashtags(newHashtags);
              }
            }}
            placeholder="Add hashtags..."
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              #{tag}
              <button
                type="button"
                onClick={() => setHashtags(hashtags.filter((t) => t !== tag))}
                className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
