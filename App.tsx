import React, { useState, useEffect, useCallback } from 'react';
import { FamilyMember, NotificationMessage, View, Location, CallState, AudioRequestState } from './types';
import { MOCK_FAMILY_MEMBERS } from './constants';
import { generateEmergencyPlan } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import SafetyTips from './components/SafetyTips';
import SOSButton from './components/SOSButton';
import Notification from './components/Notification';
import BottomNav from './components/BottomNav';
import EmergencyModal from './components/EmergencyModal';
import VideoCallView from './components/AudioCallView';
import IncomingCallModal from './components/IncomingCallModal';
import ChatView from './components/ChatView';
import IncomingAudioRequestModal from './components/IncomingAudioRequestModal';
import AudioStreamView from './components/AudioStreamView';

const App: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [currentUserLocation, setCurrentUserLocation] = useState<Location | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [emergencyPlan, setEmergencyPlan] = useState<string | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState<boolean>(false);

  // Video Call State
  const [callState, setCallState] = useState<CallState>('idle');
  const [callPartner, setCallPartner] = useState<FamilyMember | null>(null);
  
  // Audio Request State
  const [audioRequestState, setAudioRequestState] = useState<AudioRequestState>('idle');
  const [audioRequestPartner, setAudioRequestPartner] = useState<FamilyMember | null>(null);

  const [chatPartner, setChatPartner] = useState<FamilyMember | null>(null);

  const currentUser = familyMembers.find(m => m.id === 0);
  const isBusy = callState !== 'idle' || audioRequestState !== 'idle';

  const addNotification = useCallback((message: string, type: NotificationMessage['type']) => {
    const newNotification = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  }, []);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString(),
          };
          setCurrentUserLocation(location);
          setFamilyMembers(prev => prev.map(m => m.id === 0 ? {...m, location} : m));
        },
        () => {
          addNotification("Could not fetch your location.", 'error');
        }
      );
    }

    // Simulate location updates for other family members
    const interval = setInterval(() => {
      setFamilyMembers(prevMembers =>
        prevMembers.map(member => {
          if (member.id === 0) return member; // User's location is updated separately
          return {
            ...member,
            location: {
              lat: member.location!.lat + (Math.random() - 0.5) * 0.001,
              lng: member.location!.lng + (Math.random() - 0.5) * 0.001,
              timestamp: new Date().toISOString(),
            },
          };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Simulate incoming calls & requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isBusy && !isSOSActive && currentView !== View.Chat) {
        const potentialCallers = familyMembers.filter(m => m.id !== 0);
        if (potentialCallers.length > 0) {
            const caller = potentialCallers[Math.floor(Math.random() * potentialCallers.length)];
            // 50/50 chance of video call or audio request
            if (Math.random() > 0.5) {
                setCallPartner(caller);
                setCallState('receiving');
                addNotification(`Incoming call from ${caller.name}`, 'info');
            } else {
                setAudioRequestPartner(caller);
                setAudioRequestState('receiving');
                addNotification(`Audio request from ${caller.name}`, 'info');
            }
        }
      }
    }, 20000); // Simulate an incoming event after 20 seconds

    return () => clearTimeout(timer);
  }, [familyMembers, isBusy, isSOSActive, addNotification, currentView]);


  const handleTriggerSOS = async () => {
    setIsSOSActive(true);
    setIsPlanLoading(true);
    setEmergencyPlan(null);
    setFamilyMembers(prev => prev.map(m => m.id === 0 ? { ...m, status: 'In SOS' } : m));
    addNotification("SOS Alert Triggered! Generating emergency plan.", 'warning');

    if (!currentUserLocation) {
        addNotification("Cannot generate emergency plan: Your location is unavailable.", 'error');
        setEmergencyPlan("Your location is unavailable. Please ensure location services are enabled.");
        setIsPlanLoading(false);
        return;
    }

    try {
        const plan = await generateEmergencyPlan(currentUserLocation);
        setEmergencyPlan(plan);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        addNotification(`Failed to generate emergency plan: ${errorMessage}`, 'error');
        setEmergencyPlan(`Could not generate an emergency plan. Please contact emergency services directly if you are in danger.\n\nError: ${errorMessage}`);
    } finally {
        setIsPlanLoading(false);
    }
  };

  const handleCancelSOS = () => {
    setIsSOSActive(false);
    setEmergencyPlan(null);
    setFamilyMembers(prev => prev.map(m => m.id === 0 && m.status === 'In SOS' ? { ...m, status: 'Safe' } : m));
    addNotification("SOS alert has been cancelled.", 'info');
  };
  
  // Video Call Handlers
  const handleStartCall = (member: FamilyMember) => {
    if (isBusy) {
      addNotification('You are already busy.', 'warning');
      return;
    }
    setCallState('requesting');
    setCallPartner(member);
    addNotification(`Calling ${member.name}...`, 'info');
    
    setTimeout(() => {
        if (callState === 'requesting' && callPartner?.id === member.id) {
            addNotification(`${member.name} answered.`, 'success');
            setCallState('in-call');
        }
    }, 3000);
  };

  const handleAcceptCall = () => {
    if (callState !== 'receiving' || !callPartner) return;
    addNotification(`Call with ${callPartner.name} started.`, 'success');
    setCallState('in-call');
  };

  const handleDeclineCall = () => {
    if (callState !== 'receiving' || !callPartner) return;
    addNotification(`You declined the call from ${callPartner.name}.`, 'info');
    setCallState('idle');
    setCallPartner(null);
  };
  
  const handleHangUp = () => {
    if (callState !== 'in-call' || !callPartner) return;
    addNotification(`Call with ${callPartner.name} ended.`, 'info');
    setCallState('idle');
    setCallPartner(null);
  };

  // Audio Request Handlers
  const handleRequestAudio = (member: FamilyMember) => {
    if (isBusy) {
      addNotification('You are already busy.', 'warning');
      return;
    }
    setAudioRequestState('requesting');
    setAudioRequestPartner(member);
    addNotification(`Requesting audio from ${member.name}...`, 'info');

    setTimeout(() => {
      if (audioRequestState === 'requesting' && audioRequestPartner?.id === member.id) {
        addNotification(`${member.name} accepted audio request.`, 'success');
        setAudioRequestState('streaming');
      }
    }, 3000);
  };
  
  const handleAcceptAudioRequest = () => {
    if (audioRequestState !== 'receiving' || !audioRequestPartner) return;
    addNotification(`Streaming audio to ${audioRequestPartner.name}.`, 'success');
    setAudioRequestState('idle'); // For the receiver, it just goes back to idle
    setAudioRequestPartner(null);
  };
  
  const handleDeclineAudioRequest = () => {
    if (audioRequestState !== 'receiving' || !audioRequestPartner) return;
    addNotification(`You declined the audio request from ${audioRequestPartner.name}.`, 'info');
    setAudioRequestState('idle');
    setAudioRequestPartner(null);
  };

  const handleEndAudioStream = () => {
     if (audioRequestState !== 'streaming' || !audioRequestPartner) return;
    addNotification(`Audio stream from ${audioRequestPartner.name} ended.`, 'info');
    setAudioRequestState('idle');
    setAudioRequestPartner(null);
  };
  
  const handleStartChat = (member: FamilyMember) => {
    setChatPartner(member);
    setCurrentView(View.Chat);
  };
  
  const handleEndChat = () => {
    setChatPartner(null);
    setCurrentView(View.Dashboard);
  };

  const handleCheckIn = () => {
    addNotification("You've checked in safely. Your family has been notified.", 'success');
  };

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard familyMembers={familyMembers} onStartCall={handleStartCall} onStartChat={handleStartChat} onRequestAudio={handleRequestAudio} isBusy={isBusy} onCheckIn={handleCheckIn} />;
      case View.Map:
        return <MapView familyMembers={familyMembers} onStartCall={handleStartCall} onStartChat={handleStartChat} onRequestAudio={handleRequestAudio} isBusy={isBusy} />;
      case View.Safety:
        return <SafetyTips addNotification={addNotification}/>;
      case View.Chat:
        return chatPartner ? <ChatView partner={chatPartner} onClose={handleEndChat} /> : <Dashboard familyMembers={familyMembers} onStartCall={handleStartCall} onStartChat={handleStartChat} onRequestAudio={handleRequestAudio} isBusy={isBusy} onCheckIn={handleCheckIn} />;
      default:
        return <Dashboard familyMembers={familyMembers} onStartCall={handleStartCall} onStartChat={handleStartChat} onRequestAudio={handleRequestAudio} isBusy={isBusy} onCheckIn={handleCheckIn} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header user={currentUser} />
      <main className="pb-20 pt-16 px-4">
        {renderView()}
      </main>
      
      {currentView !== View.Chat && <SOSButton onTrigger={handleTriggerSOS} />}
      
      <div className="fixed top-16 right-0 m-4 space-y-2 z-50">
        {notifications.map(notif => (
          <Notification key={notif.id} message={notif.message} type={notif.type} />
        ))}
      </div>
      
      {currentView !== View.Chat && <BottomNav currentView={currentView} setView={setCurrentView} />}

      {isSOSActive && (
        <EmergencyModal 
          plan={emergencyPlan}
          isLoading={isPlanLoading}
          onClose={handleCancelSOS}
        />
      )}
      {callState === 'receiving' && callPartner && (
        <IncomingCallModal 
            caller={callPartner}
            onAccept={handleAcceptCall}
            onDecline={handleDeclineCall}
        />
      )}
      {callState === 'in-call' && callPartner && (
        <VideoCallView 
            partner={callPartner}
            onHangUp={handleHangUp}
            addNotification={addNotification}
        />
      )}
      {audioRequestState === 'receiving' && audioRequestPartner && (
        <IncomingAudioRequestModal 
            requester={audioRequestPartner}
            onAccept={handleAcceptAudioRequest}
            onDecline={handleDeclineAudioRequest}
        />
      )}
      {audioRequestState === 'streaming' && audioRequestPartner && (
        <AudioStreamView 
            partner={audioRequestPartner}
            onStop={handleEndAudioStream}
        />
      )}
    </div>
  );
};

export default App;