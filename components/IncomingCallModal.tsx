import React from 'react';
import { FamilyMember } from '../types';

interface IncomingCallModalProps {
  caller: FamilyMember;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ caller, onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm text-white transform animate-fade-in-up p-6 text-center">
        <img src={caller.avatar} alt={caller.name} className="w-24 h-24 rounded-full border-4 border-gray-600 shadow-lg mx-auto" />
        <h2 className="text-2xl font-bold mt-4">Incoming Call</h2>
        <p className="text-gray-400 text-lg mt-1">{caller.name}</p>
        <p className="text-sm text-gray-500 mt-2">Video and Audio</p>

        <div className="flex justify-around mt-8">
          <button
            onClick={onDecline}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform"
            aria-label="Decline Call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" transform="rotate(-135 12 12)" />
            </svg>
          </button>
          <button
            onClick={onAccept}
            className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform"
            aria-label="Accept Call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
