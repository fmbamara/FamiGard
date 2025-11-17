import React, { useState, useEffect } from 'react';
import { FamilyMember, NotificationMessage } from '../types';

interface CallViewProps {
  partner: FamilyMember;
  onHangUp: () => void;
  addNotification: (message: string, type: NotificationMessage['type']) => void;
}

const CallActionButton: React.FC<{
  onClick: () => void;
  label: string;
  icon: React.ReactElement;
  active?: boolean;
  className?: string;
}> = ({ onClick, label, icon, active = false, className = '' }) => (
  <div className="flex flex-col items-center">
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
        active ? 'bg-white/30' : 'bg-gray-500/50 hover:bg-gray-500/80'
      } ${className}`}
      aria-label={label}
    >
      {icon}
    </button>
    <span className="text-xs mt-2 text-gray-300">{label}</span>
  </div>
);

const VideoCallView: React.FC<CallViewProps> = ({ partner, onHangUp, addNotification }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  useEffect(() => {
    const callTimer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(callTimer);
  }, []);

  useEffect(() => {
    let recordingTimer: number;
    if (isRecording) {
      recordingTimer = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(recordingTimer);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const handleToggleRecording = () => {
    setIsRecording(prev => {
        if (!prev) {
            addNotification("Call recording started.", "info");
            setRecordingDuration(0);
        } else {
            addNotification("Call recording stopped.", "info");
        }
        return !prev;
    });
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(prev => {
        addNotification(`Video ${!prev ? 'enabled' : 'disabled'}.`, "info");
        return !prev;
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col justify-between z-50 animate-fade-in">
      {/* Partner Video Feed (background) */}
      <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
        {isVideoEnabled ? (
          <img src={partner.avatar} alt={partner.name} className="min-w-full min-h-full object-cover opacity-30 blur-sm" />
        ) : (
            <div className="flex flex-col items-center">
                <img src={partner.avatar} alt={partner.name} className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-lg" />
                <p className="text-white text-xl mt-4">{partner.name}'s video is off</p>
            </div>
        )}
      </div>

       {/* My Video Feed (PiP) */}
      <div className="absolute top-4 right-4 w-24 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 shadow-lg overflow-hidden flex items-center justify-center">
         {isVideoEnabled ? (
            <img src="https://picsum.photos/seed/my-video/100/150" alt="My Video" className="w-full h-full object-cover" />
         ) : (
            <div className="flex flex-col items-center justify-center text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M1 14l4-4m-4 4l4 4m-4-4h12a2 2 0 002-2V8a2 2 0 00-2-2H5" /></svg>
                 <span className="text-xs mt-1">Video Off</span>
            </div>
         )}
      </div>
      
      {/* Call Info & Controls (foreground) */}
      <div className="relative z-10 flex flex-col justify-end h-full p-4">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white shadow-black [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">On Call with {partner.name}</h2>
            <p className="text-gray-200 text-lg shadow-black [text-shadow:_0_1px_2px_var(--tw-shadow-color)]">{formatTime(duration)}</p>
            {isRecording && (
                <div className="flex items-center justify-center mt-2 text-red-400 animate-pulse font-semibold">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>REC {formatTime(recordingDuration)}</span>
                </div>
            )}
        </div>
        
        <div className="flex justify-around items-center bg-black/30 backdrop-blur-sm rounded-full p-4">
          <CallActionButton 
            onClick={handleToggleVideo}
            label={isVideoEnabled ? "Video Off" : "Video On"}
            icon={ isVideoEnabled ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M1 14l4-4m-4 4l4 4m-4-4h12a2 2 0 002-2V8a2 2 0 00-2-2H5" /></svg> :
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            }
            active={!isVideoEnabled}
          />
          <CallActionButton 
            onClick={handleToggleRecording}
            label={isRecording ? "Stop Rec" : "Record"}
            icon={ isRecording ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16v16H4z"/>
                </svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="7" />
                </svg>
            )}
            active={isRecording}
            className={isRecording ? '!bg-red-600 animate-pulse' : ''}
          />
           <CallActionButton 
            onClick={() => setIsMuted(prev => !prev)}
            label={isMuted ? "Unmute" : "Mute"}
            icon={ isMuted ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2L17 10" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            }
            active={isMuted}
          />
          <button
            onClick={onHangUp}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform"
            aria-label="Hang Up"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" transform="rotate(-135 12 12)" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallView;