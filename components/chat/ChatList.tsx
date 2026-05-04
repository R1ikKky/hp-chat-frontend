'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'unread' | 'dms' | 'groups';

const TABS: Tab[] = ['all', 'unread', 'dms', 'groups'];

export function ChatList() {
  const [tab, setTab] = useState<Tab>('all');

  return (
    <div className="flex flex-col w-[280px] shrink-0 border-r border-[#1e2e1e] bg-[#0a160a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#e2fce4] font-semibold text-base">chats</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-0.5" />
        </div>
        <button className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#22c55e] text-black hover:bg-[#16a34a] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#111a12] border border-[#1e2e1e]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a5a3a" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="search..."
            className="flex-1 bg-transparent text-sm text-[#e2fce4] placeholder-[#3a5a3a] outline-none"
          />
          <span className="text-[10px] text-[#3a5a3a] font-mono bg-[#0d1410] px-1.5 py-0.5 rounded border border-[#1e2e1e]">
            ⌘K
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
              tab === t
                ? 'bg-[#22c55e] text-black'
                : 'text-[#4a6e4a] hover:text-[#e2fce4] hover:bg-[#111a12]',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 pb-8 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#111a12] border border-[#1e2e1e] text-[#2a4a2a]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-[#4a6e4a] font-medium">no chats yet</p>
          <p className="text-xs text-[#2a4a2a] mt-0.5">start a conversation with +</p>
        </div>
      </div>
    </div>
  );
}
