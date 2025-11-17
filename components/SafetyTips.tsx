import React, { useState, useCallback } from 'react';
import { generateSafetyTips } from '../services/geminiService';
import { NotificationMessage } from '../types';

interface SafetyTipsProps {
    addNotification: (message: string, type: NotificationMessage['type']) => void;
}

const categories = [
    'Child Safety',
    'Online Safety',
    'Travel Safety',
    'Home Security',
    'Natural Disasters',
    'Personal Safety',
];

const SafetyTips: React.FC<SafetyTipsProps> = ({ addNotification }) => {
  const [topic, setTopic] = useState<string>('');
  const [tips, setTips] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayedTopic, setDisplayedTopic] = useState<string>('');

  const fetchTipsForTopic = useCallback(async (currentTopic: string) => {
    if (!currentTopic.trim()) {
      addNotification('Please enter or select a topic for safety tips.', 'warning');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTips('');
    setDisplayedTopic(currentTopic);
    try {
      const generatedTips = await generateSafetyTips(currentTopic);
      setTips(generatedTips);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to generate tips: ${errorMessage}`);
      addNotification(`Failed to generate tips: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTipsForTopic(topic);
  };

  const handleCategoryClick = (category: string) => {
    setTopic(category);
    fetchTipsForTopic(category);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">AI Safety Tips</h2>
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <p className="text-gray-400 mb-4">
          Select a category or enter a custom topic to get personalized safety advice from our AI assistant.
        </p>

        <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-300 mb-3">Browse by Category</h3>
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        disabled={isLoading}
                        className="bg-gray-700/80 text-gray-300 text-sm py-2 px-4 rounded-full hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
        
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Or type your own topic, e.g., 'hiking alone'"
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </div>
            ) : 'Get Tips'}
          </button>
        </form>
      </div>
      
      {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}

      {tips && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-red-400">Safety Tips for "{displayedTopic}"</h3>
          <div className="prose prose-invert text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: tips.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </div>
  );
};

export default SafetyTips;
