
import React from 'react';
import { NotificationMessage } from '../types';

interface NotificationProps {
  message: string;
  type: NotificationMessage['type'];
}

const typeStyles = {
  success: 'bg-green-500/80 border-green-400',
  error: 'bg-red-500/80 border-red-400',
  info: 'bg-blue-500/80 border-blue-400',
  warning: 'bg-yellow-500/80 border-yellow-400',
};

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  return (
    <div className={`w-64 p-3 rounded-lg shadow-md text-white text-sm border ${typeStyles[type]} animate-fade-in-right`}>
      {message}
    </div>
  );
};

// Add keyframes for animation in a style tag for simplicity in this setup
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fade-in-right {
  animation: fade-in-right 0.5s ease-out forwards;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`;
document.head.appendChild(style);


export default Notification;