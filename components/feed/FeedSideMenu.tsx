import React, { useState } from 'react';
import { X, Settings, Heart, MessageCircle, Bell } from 'lucide-react';
import ResponsiveSidebar from '../sidebars/ResponsiveSidebar';
import SidebarItem from '../sidebars/SidebarItem';
import SidebarSection from '../sidebars/SidebarSection';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'system';
  user?: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'User1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    content: 'liked your post "Today is good..."',
    time: '2m ago'
  },
  {
    id: '2',
    type: 'comment',
    user: {
      name: 'User2',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    content: 'commented: "Nice photo!"',
    time: '1h ago'
  },
  {
    id: '3',
    type: 'system',
    content: 'Welcome to Feed! Start posting today.',
    time: '1d ago'
  }
];

interface FeedSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedSideMenu: React.FC<FeedSideMenuProps> = ({ isOpen, onClose }) => {
  return (
    <ResponsiveSidebar
      isOpen={isOpen}
      onClose={onClose}
      title="알림"
      hideCloseButton={true}
      headerAction={
        <button 
          className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          title="설정"
        >
          <Settings size={20} />
        </button>
      }
    >
      <div className="flex flex-col gap-4 py-4 px-2">
        {mockNotifications.map((notif) => (
          <div key={notif.id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            {/* Icon/Avatar */}
            <div className="relative flex-shrink-0">
              {notif.user ? (
                <img 
                  src={notif.user.avatar} 
                  alt={notif.user.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Bell size={20} />
                </div>
              )}
              
              {/* Type Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                {notif.type === 'like' && <Heart size={10} className="text-red-500 fill-current" />}
                {notif.type === 'comment' && <MessageCircle size={10} className="text-blue-500 fill-current" />}
                {notif.type === 'system' && <Bell size={10} className="text-teal-500" />}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 dark:text-white line-clamp-2">
                {notif.user && <span className="font-bold mr-1">{notif.user.name}</span>}
                {notif.content}
              </p>
              <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ResponsiveSidebar>
  );
};

export default FeedSideMenu;
