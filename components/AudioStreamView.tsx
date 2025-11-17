import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types';

interface AudioStreamViewProps {
  partner: FamilyMember;
  onStop: () => void;
}

const AudioStreamView: React.FC<AudioStreamViewProps> = ({ partner, onStop }) => {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="fixed inset-0 bg-gray-900/95 flex flex-col items-center justify-center z-50 animate-fade-in p-4">
            <img src={partner.avatar} alt={partner.name} className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4" />
            <h2 className="text-2xl font-bold text-white">Listening to {partner.name}</h2>
            <p className="text-gray-400">Live Audio Stream</p>
            
            <div className="my-8 flex items-center space-x-3 text-blue-400 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <span className="text-2xl font-mono">{formatTime(duration)}</span>
            </div>

            <button
                onClick={onStop}
                className="bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span>Stop Listening</span>
            </button>
        </div>
    );
};

export default AudioStreamView;