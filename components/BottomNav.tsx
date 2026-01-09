
import React from 'react';
import { Home, Search, PlusCircle, Calendar, User } from 'lucide-react';

interface BottomNavProps {
  onActionClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onActionClick }) => {
  // Mobile bottom nav only shown when logged in or on specific app pages
  // For the landing page, we match the desktop-like scrolling experience
  return null;
};

export default BottomNav;
