import React from 'react';
import { FamilyMember } from '../types';

interface MemberCardProps {
  member: FamilyMember;
  onStartCall: (member: FamilyMember) => void;
  onStartChat: (member: FamilyMember) => void;
  onRequestAudio: (member: FamilyMember) => void;
  isBusy: boolean;
}

const statusStyles = {
    'Safe': 'bg-green-500/20 text-green-400 border-green-500/30',
    'In SOS': 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse',
    'Offline': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

const MemberCard: React.FC<MemberCardProps> = ({ member, onStartCall, onStartChat, onRequestAudio, isBusy }) => {
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

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border ${statusStyles[member.status]} transition-all duration-300`}>
      <div className="flex items-center space-x-4 mb-4">
        <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full border-2 border-gray-600" />
        <div>
          <h3 className="text-lg font-bold text-white">{member.name}</h3>
          <p className={`text-sm font-semibold ${statusStyles[member.status].split(' ')[1]}`}>{member.status}</p>
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400 flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>
            {member.location ? `Lat: ${member.location.lat.toFixed(4)}, Lng: ${member.location.lng.toFixed(4)}` : 'Location unknown'}
          </span>
        </div>
        <p className="text-xs text-gray-500 text-right">Updated {timeAgo(member.location?.timestamp || new Date().toISOString())}</p>
      </div>
       {member.id !== 0 && (
         <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end space-x-2">
           <button 
             onClick={() => onStartChat(member)}
             disabled={isBusy}
             className="px-3 py-1 text-xs font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
             Message
           </button>
            <button 
             onClick={() => onRequestAudio(member)}
             disabled={isBusy}
             className="px-3 py-1 text-xs font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
             Request Audio
           </button>
           <button 
             onClick={() => onStartCall(member)}
             disabled={isBusy}
             className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
             Call
           </button>
         </div>
       )}
    </div>
  );
};

export default MemberCard;