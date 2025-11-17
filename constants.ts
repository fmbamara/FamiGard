
import { FamilyMember } from './types';

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 0,
    name: 'You',
    avatar: 'https://picsum.photos/seed/you/100',
    status: 'Safe',
    location: { lat: 34.0522, lng: -118.2437, timestamp: new Date().toISOString() },
  },
  {
    id: 1,
    name: 'Mom',
    avatar: 'https://picsum.photos/seed/mom/100',
    status: 'Safe',
    location: { lat: 34.055, lng: -118.245, timestamp: new Date().toISOString() },
  },
  {
    id: 2,
    name: 'Dad',
    avatar: 'https://picsum.photos/seed/dad/100',
    status: 'Safe',
    location: { lat: 34.050, lng: -118.240, timestamp: new Date().toISOString() },
  },
  {
    id: 3,
    name: 'Jessica',
    avatar: 'https://picsum.photos/seed/jessica/100',
    status: 'Offline',
    location: { lat: 34.048, lng: -118.250, timestamp: new Date(Date.now() - 3600 * 1000).toISOString() },
  },
];
