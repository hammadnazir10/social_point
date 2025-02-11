import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Button from "@/components/common/Button";
import { useToast } from "@/hooks/useToast";
import { IconMicrophone, IconSend } from "@tabler/icons-react";
import { getAnonymousUserId } from "@/hooks/anonymousUser";

const ReplyForm = ({ onSubmit, parentCommentId, topicId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tempAudioUrl, setTempAudioUrl] = useState(null);
  const userId = getAnonymousUserId();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { startRecording, stopRecording, recordingBlob, isRecording } =
    useAudioRecorder();

  useEffect(() => {
    if (!recordingBlob) return;

    const uploadAudio = async () => {
      try {
        setIsLoading(true);
        const uniqueFileName = `audio_${uuidv4()}_${Date.now()}.mp3`;
        const formData = new FormData();
        formData.append("fileUrl", recordingBlob, uniqueFileName);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/createUrlForpicture`,
          formData
        );

        setTempAudioUrl(response.data.response);
        showToast("Recording saved temporarily", "success");
      } catch (error) {
        showToast(
          error.response?.data?.message || "Error uploading audio",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    uploadAudio();
  }, [recordingBlob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tempAudioUrl) {
      showToast("Please record a voice reply", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments`,
        {
          parentCommentId,
          topicId,
          audioUrl: tempAudioUrl,
          userId,
        }
      );

      onSubmit(response.data.data);
      setTempAudioUrl(null);
      showToast("Reply added successfully", "success");
      navigate(0); // Refresh the page
    } catch (error) {
      showToast(
        error.response?.data?.message || "Error posting reply",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <IconMicrophone className="w-5 h-5" />
          <span>{isRecording ? "Save Recording" : "Start Recording"}</span>
        </Button>

        {tempAudioUrl && (
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <IconSend className="w-5 h-5" />
            <span>Reply</span>
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReplyForm;
