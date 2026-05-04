'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Sidebar } from './Sidebar';
import { ChatList } from './ChatList';
import { ChatPanel } from './ChatPanel';

type NavItem = 'home' | 'profile' | 'chats' | 'saved' | 'calendar';

export function ChatLayout() {
  const [activeNav, setActiveNav] = useState<NavItem>('chats');
  const login = useAuthStore((s) => s.login);
  const userInitial = (login?.[0] ?? '?').toUpperCase();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080d08]">
      <Sidebar active={activeNav} userInitial={userInitial} onNav={setActiveNav} />
      <ChatList />
      <ChatPanel />
    </div>
  );
}
