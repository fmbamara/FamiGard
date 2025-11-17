
import React, { useState } from 'react';

interface SOSButtonProps {
  onTrigger: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onTrigger }) => {
  const [confirming, setConfirming] = useState(false);

  const handleSOSClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    } else {
      onTrigger();
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleSOSClick}
      className={`fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-110 ${
        confirming ? 'bg-yellow-500' : 'bg-red-600 hover:bg-red-700'
      }`}
    >
      <div className="text-center leading-tight">
        {confirming ? (
          <span className="text-xs">Confirm?</span>
        ) : (
          <span className="text-lg">SOS</span>
        )}
      </div>
    </button>
  );
};

export default SOSButton;
