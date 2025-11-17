
import React from 'react';

interface EmergencyModalProps {
  isLoading: boolean;
  plan: string | null;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isLoading, plan, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl w-full max-w-lg text-white transform animate-fade-in-up">
        <div className="p-6 border-b border-red-500/50">
          <h2 className="text-2xl font-bold text-red-500 text-center animate-pulse">
            EMERGENCY MODE ACTIVATED
          </h2>
          <p className="text-center text-gray-400 mt-1">Your family has been notified.</p>
        </div>
        
        <div className="p-6 min-h-[200px] max-h-[60vh] overflow-y-auto">
          {isLoading && (
             <div className="flex flex-col items-center justify-center h-full">
                <svg className="animate-spin h-10 w-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg text-gray-300">Generating location-aware plan...</p>
             </div>
          )}
          {plan && (
            <div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Immediate Action Plan:</h3>
                <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{plan}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-red-500/50">
            <button
                onClick={onClose}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 transition-colors text-lg"
            >
                I'm Safe (Cancel SOS)
            </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;
