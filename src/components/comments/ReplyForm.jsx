import { useState, useEffect } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Button from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { IconMicrophone } from '@tabler/icons-react';

const ReplyForm = ({ onSubmit, onCancel, parentCommentId, topicId }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempAudioUrl, setTempAudioUrl] = useState(null);
  const { showToast } = useToast();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tempAudioUrl && !content.trim()) {
      showToast('Please record a voice reply or enter text', 'error');
      return;
    }

    onSubmit({ content, audioUrl: tempAudioUrl });
    setContent('');
    setTempAudioUrl(null);
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
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <IconMicrophone className="w-5 h-5" />
          <span>{isRecording ? 'Save Recording' : 'Start Recording'}</span>
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
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