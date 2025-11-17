import React from 'react';
import { FamilyMember } from '../types';

interface IncomingAudioRequestModalProps {
  requester: FamilyMember;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingAudioRequestModal: React.FC<IncomingAudioRequestModalProps> = ({ requester, onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm text-white transform animate-fade-in-up p-6 text-center">
        <img src={requester.avatar} alt={requester.name} className="w-24 h-24 rounded-full border-4 border-gray-600 shadow-lg mx-auto" />
        <h2 className="text-2xl font-bold mt-4">Incoming Audio Request</h2>
        <p className="text-gray-400 text-lg mt-1">{requester.name}</p>
        <p className="text-sm text-gray-500 mt-2">is requesting to listen to your live audio.</p>

        <div className="flex justify-around mt-8">
          <button
            onClick={onDecline}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform"
            aria-label="Decline Request"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button
            onClick={onAccept}
            className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform"
            aria-label="Accept Request"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingAudioRequestModal;