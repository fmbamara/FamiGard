export interface Location {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
  status: 'Safe' | 'In SOS' | 'Offline';
  location: Location | null;
}

export interface NotificationMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export enum View {
    Dashboard = 'DASHBOARD',
    Map = 'MAP',
    Safety = 'SAFETY',
    Chat = 'CHAT',
}

export type CallState = 'idle' | 'requesting' | 'in-call' | 'receiving';
export type AudioRequestState = 'idle' | 'requesting' | 'streaming' | 'receiving';

export interface ChatMessage {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    audioUrl?: string;
    audioDuration?: number;
}