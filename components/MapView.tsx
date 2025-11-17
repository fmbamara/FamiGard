import React, { useState } from 'react';
import { FamilyMember } from '../types';

interface MapViewProps {
  familyMembers: FamilyMember[];
  onStartCall: (member: FamilyMember) => void;
  onStartChat: (member: FamilyMember) => void;
  onRequestAudio: (member: FamilyMember) => void;
  isBusy: boolean;
}

const statusColors = {
  'Safe': 'bg-green-500',
  'In SOS': 'bg-red-500',
  'Offline': 'bg-gray-500'
};

const statusStyles = {
    'Safe': 'bg-green-500/20 text-green-400 border-green-500/30',
    'In SOS': 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse',
    'Offline': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
}

const MapView: React.FC<MapViewProps> = ({ familyMembers, onStartCall, onStartChat, onRequestAudio, isBusy }) => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Family Map</h2>
      <div className="relative w-full h-96 bg-gray-700 rounded-lg overflow-hidden">
        <img src="https://picsum.photos/seed/map/1200/800" alt="Map" className="w-full h-full object-cover opacity-50" />
        {familyMembers.filter(m => m.location).map(member => (
          <button
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full focus:outline-none"
            style={{
              top: `${(member.location!.lat - 34.04) * 1000 + 50}%`,
              left: `${(member.location!.lng + 118.25) * 1000 + 50}%`,
            }}
          >
            <div className={`w-4 h-4 rounded-full ${statusColors[member.status]} border-2 border-white shadow-lg transition-transform duration-300 ${selectedMember?.id === member.id ? 'scale-150 ring-2 ring-white' : ''}`}></div>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black/50 px-1 rounded whitespace-nowrap">{member.name}</span>
          </button>
        ))}

        {selectedMember && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-gray-800/80 backdrop-blur-md rounded-lg p-4 border border-gray-600 shadow-2xl animate-fade-in-up z-10">
                <button onClick={() => setSelectedMember(null)} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                <div className="flex items-center space-x-4 mb-3">
                    <img src={selectedMember.avatar} alt={selectedMember.name} className="w-12 h-12 rounded-full border-2 border-gray-600" />
                    <div>
                        <h3 className="text-lg font-bold text-white">{selectedMember.name}</h3>
                        <p className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[selectedMember.status]}`}>{selectedMember.status}</p>
                    </div>
                </div>
                 <div className="text-sm text-gray-400 flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>
                        {selectedMember.location ? `Lat: ${selectedMember.location.lat.toFixed(4)}, Lng: ${selectedMember.location.lng.toFixed(4)}` : 'Location unknown'}
                    </span>
                </div>
                <p className="text-xs text-gray-500 text-right mb-3">Updated {timeAgo(selectedMember.location?.timestamp || new Date().toISOString())}</p>
                
                {selectedMember.id !== 0 && (
                    <div className="pt-3 border-t border-gray-700 flex justify-end space-x-2">
                        <button 
                            onClick={() => {
                                onStartChat(selectedMember);
                                setSelectedMember(null);
                            }}
                            disabled={isBusy}
                            className="px-3 py-1.5 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                            Message
                        </button>
                        <button 
                            onClick={() => {
                                onRequestAudio(selectedMember);
                                setSelectedMember(null);
                            }}
                            disabled={isBusy}
                            className="px-3 py-1.5 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                            Request Audio
                        </button>
                        <button 
                            onClick={() => {
                                onStartCall(selectedMember);
                                setSelectedMember(null);
                            }}
                            disabled={isBusy}
                            className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                            Call
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
       <div className="mt-4 flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status, colorClass]) => (
            <div key={status} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${colorClass} mr-2`}></div>
              <span className="text-sm text-gray-400">{status}</span>
            </div>
          ))}
        </div>
    </div>
  );
};

export default MapView;