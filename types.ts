import React from 'react';

export interface FeedItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  type: 'journal' | 'schedule' | 'memory';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  // Fix: Import React to resolve React namespace for ReactNode
  icon: React.ReactNode;
  color: string;
}
