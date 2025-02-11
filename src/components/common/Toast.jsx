import { IconX, IconCheck, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react';

/**
 * Toast component for displaying notifications
 * @param {Object} props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, info, warning)
 * @param {Function} props.onClose - Close handler
 */
const Toast = ({ message, type = 'info', onClose }) => {
  const types = {
    success: {
      icon: <IconCheck className="w-5 h-5" />,
      bg: 'bg-green-500',
      text: 'text-white'
    },
    error: {
      icon: <IconX className="w-5 h-5" />,
      bg: 'bg-red-500',
      text: 'text-white'
    },
    info: {
      icon: <IconInfoCircle className="w-5 h-5" />,
      bg: 'bg-blue-500',
      text: 'text-white'
    },
    warning: {
      icon: <IconAlertTriangle className="w-5 h-5" />,
      bg: 'bg-yellow-500',
      text: 'text-white'
    }
  };

  const { icon, bg, text } = types[type];

  return (
    <div
      className={`${bg} ${text} rounded-lg shadow-lg p-4 flex items-center justify-between min-w-[300px] max-w-md animate-slide-up`}
      role="alert"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:opacity-80 transition-opacity"
        aria-label="Close"
      >
        <IconX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;