import React from 'react';
import { FamilyMember } from '../types';
import MemberCard from './MemberCard';

interface DashboardProps {
  familyMembers: FamilyMember[];
  onStartCall: (member: FamilyMember) => void;
  onStartChat: (member: FamilyMember) => void;
  onRequestAudio: (member: FamilyMember) => void;
  isBusy: boolean;
  onCheckIn: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ familyMembers, onStartCall, onStartChat, onRequestAudio, isBusy, onCheckIn }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">Family Members</h2>
        <button 
          onClick={onCheckIn}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Quick Check-in</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map(member => (
          <MemberCard key={member.id} member={member} onStartCall={onStartCall} onStartChat={onStartChat} onRequestAudio={onRequestAudio} isBusy={isBusy} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;