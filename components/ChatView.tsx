import React, { useState, useEffect, useRef } from 'react';
import { FamilyMember, ChatMessage } from '../types';

interface ChatViewProps {
  partner: FamilyMember;
  onClose: () => void;
}

const VoiceMessagePlayer: React.FC<{ audioUrl: string; duration: number }> = ({ audioUrl, duration }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const formatDuration = (secs: number) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => {
            if (audio.duration > 0) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };
        
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    return (
        <div className="flex items-center gap-2" style={{minWidth: '180px'}}>
            <audio ref={audioRef} src={audioUrl} preload="auto" />
            <button onClick={togglePlay} className="text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white flex-shrink-0">
                {isPlaying ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
            </button>
            <div className="w-full h-1 bg-gray-500/50 rounded-full">
                <div className="h-1 bg-white rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs w-10 text-right font-mono">{formatDuration(duration)}</span>
        </div>
    );
};


const ChatView: React.FC<ChatViewProps> = ({ partner, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, senderId: partner.id, text: "Hey! Just checking in, are you okay?", timestamp: new Date(Date.now() - 60000 * 5).toISOString() },
        { id: 2, senderId: 0, text: "Hey, I'm good! Thanks for asking. Just finishing up some work.", timestamp: new Date(Date.now() - 60000 * 4).toISOString() },
        { id: 3, senderId: partner.id, text: "Great to hear!", timestamp: new Date(Date.now() - 60000 * 3).toISOString() },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const messagesEndRef = useRef<HTMLLIElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingTimerRef = useRef<number | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isRecording) {
            inputRef.current?.focus();
        }
    }, [isRecording]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            senderId: 0,
            text: newMessage,
            timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        setTimeout(() => {
            const replyMessage: ChatMessage = {
                id: Date.now() + 1,
                senderId: partner.id,
                text: "Sounds good!",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1500);
    };

    const sendVoiceMessage = (audioUrl: string, duration: number) => {
        const voiceMessage: ChatMessage = {
            id: Date.now(),
            senderId: 0,
            text: `Voice Message`,
            timestamp: new Date().toISOString(),
            audioUrl,
            audioDuration: duration
        };
        setMessages(prev => [...prev, voiceMessage]);
        
        setTimeout(() => {
            const replyMessage: ChatMessage = {
                id: Date.now() + 1,
                senderId: partner.id,
                text: "Got your voice message!",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1500);
    };

    const handleStartRecording = async () => {
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.addEventListener("dataavailable", event => {
                audioChunksRef.current.push(event.data);
            });

            mediaRecorderRef.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                sendVoiceMessage(audioUrl, recordingTime);
                stream.getTracks().forEach(track => track.stop());
            });

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            recordingTimerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const handleStopRecording = () => {
        if (!mediaRecorderRef.current || !isRecording) return;
        
        mediaRecorderRef.current.stop();
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
        }
        setIsRecording(false);
    };

    const formatRecordingTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col z-50 animate-fade-in" role="application" aria-label={`Chat with ${partner.name}`}>
            <header className="flex-shrink-0 bg-gray-800/80 backdrop-blur-sm shadow-md z-10">
                <div className="container mx-auto px-4 py-3 flex items-center">
                    <button onClick={onClose} className="text-white mr-4 p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <img src={partner.avatar} alt={`${partner.name}'s avatar`} className="w-8 h-8 rounded-full mr-3" />
                    <h2 id="chat-header" className="text-lg font-bold text-white">{partner.name}</h2>
                </div>
            </header>

            <ul className="flex-grow p-4 overflow-y-auto space-y-4" role="log" aria-live="polite" aria-labelledby="chat-header">
                {messages.map((msg) => (
                    <li key={msg.id} className={`flex items-end gap-2 ${msg.senderId === 0 ? 'justify-end' : 'justify-start'}`}>
                        {msg.senderId !== 0 && <img src={partner.avatar} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />}
                        <div className={`max-w-xs md:max-w-md px-3 py-2 rounded-2xl ${msg.senderId === 0 ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                           {msg.audioUrl && msg.audioDuration !== undefined ? (
                                <VoiceMessagePlayer audioUrl={msg.audioUrl} duration={msg.audioDuration} />
                            ) : (
                                <p>{msg.text}</p>
                            )}
                        </div>
                    </li>
                ))}
                <li ref={messagesEndRef} aria-hidden="true" />
            </ul>

            <div className="flex-shrink-0 p-4 bg-gray-800/80 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2" aria-label="Chat input form">
                    <label htmlFor="chat-input" className="sr-only">Type a message</label>
                    <input
                        id="chat-input"
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isRecording ? `Recording... ${formatRecordingTime(recordingTime)}` : "Type a message..."}
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-600/50"
                        disabled={isRecording}
                    />
                    <button
                        type={newMessage.trim() && !isRecording ? "submit" : "button"}
                        onClick={() => {
                            if (isRecording) {
                                handleStopRecording();
                            } else if (!newMessage.trim()) {
                                handleStartRecording();
                            }
                        }}
                        className={`flex-shrink-0 text-white rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-red-600 hover:bg-red-700'}`}
                        aria-label={isRecording ? "Stop recording" : (newMessage.trim() ? "Send message" : "Record voice message")}
                        disabled={!isRecording && !newMessage.trim() && false}
                    >
                        {isRecording ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
                        ) : newMessage.trim() ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatView;