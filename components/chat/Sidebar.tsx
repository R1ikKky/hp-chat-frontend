'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useLogoutMutation } from '@/lib/auth-mutations';

type NavItem = 'home' | 'profile' | 'chats' | 'saved' | 'calendar';

interface SidebarProps {
  active: NavItem;
  userInitial: string;
  onNav: (item: NavItem) => void;
}

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

const topNav: { id: NavItem; Icon: () => React.ReactNode }[] = [
  { id: 'home', Icon: IconHome },
  { id: 'profile', Icon: IconUser },
  { id: 'chats', Icon: IconChat },
  { id: 'saved', Icon: IconBookmark },
  { id: 'calendar', Icon: IconCalendar },
];

export function Sidebar({ active, userInitial, onNav }: SidebarProps) {
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <aside className="flex flex-col items-center w-[60px] shrink-0 bg-[#0d1410] border-r border-[#1e2e1e] py-3 gap-1">
      {/* Top nav icons */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {topNav.map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={cn(
              'relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors',
              active === id
                ? 'bg-[#22c55e] text-black'
                : 'text-[#4a6e4a] hover:text-[#e2fce4] hover:bg-[#111a12]',
            )}
          >
            <Icon />
            {id === 'chats' && active !== 'chats' && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22c55e]" />
            )}
          </button>
        ))}
      </div>

      {/* Bottom: bell, logout, avatar */}
      <div className="flex flex-col items-center gap-2">
        <button className="flex items-center justify-center w-10 h-10 rounded-xl text-[#4a6e4a] hover:text-[#e2fce4] hover:bg-[#111a12] transition-colors">
          <IconBell />
        </button>

        <button
          onClick={() => logout()}
          disabled={isPending}
          title="Sign out"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-[#4a6e4a] hover:text-red-400 hover:bg-[#111a12] transition-colors disabled:opacity-40"
        >
          <IconLogout />
        </button>

        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#22c55e] text-black text-sm font-bold select-none mt-1">
          {userInitial}
        </div>
      </div>
    </aside>
  );
}
