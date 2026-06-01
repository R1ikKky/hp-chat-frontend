'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import type { Conversation } from '@/lib/types/chat';

type Tab = 'all' | 'unread' | 'dms' | 'groups';
const TABS: Tab[] = ['all', 'unread', 'dms', 'groups'];

interface ChatListProps {
  onNewChat: () => void;
}

function getConversationName(conv: Conversation, myUserId: string | null): string {
  if (conv.name) return conv.name;
  if (conv.type === 'direct') {
    const other = conv.participants.find((p) => p.userId !== myUserId);
    return other?.userId.slice(0, 8) ?? 'direct message';
  }
  return 'unnamed group';
}

function getInitial(name: string): string {
  return (name[0] ?? '?').toUpperCase();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function ChatList({ onNewChat }: ChatListProps) {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);
  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const userId = useAuthStore((s) => s.userId);

  const filtered = conversations.filter((c) => {
    if (tab === 'dms' && c.type !== 'direct') return false;
    if (tab === 'groups' && c.type !== 'group') return false;
    if (search) {
      const name = getConversationName(c, userId).toLowerCase();
      if (!name.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-[280px] shrink-0 border-r border-[#1e2e1e] bg-[#0a160a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#e2fce4] font-semibold text-base">chats</span>
          {conversations.length > 0 && (
            <span className="text-xs text-[#3a5a3a]">{conversations.length}</span>
          )}
        </div>
        <button
          onClick={onNewChat}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#22c55e] text-black hover:bg-[#16a34a] transition-colors"
        >
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#e2fce4] placeholder-[#3a5a3a] outline-none"
          />
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

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 pb-8 pt-12 text-center">
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
        ) : (
          filtered.map((conv) => {
            const name = getConversationName(conv, userId);
            const isActive = conv.id === activeId;
            const otherParticipant = conv.participants.find((p) => p.userId !== userId);
            const isOnline = otherParticipant
              ? onlineUsers.includes(otherParticipant.userId)
              : false;

            return (
              <button
                key={conv.id}
                onClick={() => setActive(conv.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  isActive ? 'bg-[#111a12]' : 'hover:bg-[#0d1410]',
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#1a2d1a] flex items-center justify-center text-[#22c55e] text-sm font-bold">
                    {getInitial(name)}
                  </div>
                  {conv.type === 'direct' && isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-[#0a160a]" />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#e2fce4] truncate">
                      {name}
                    </span>
                    <span className="text-[10px] text-[#3a5a3a] shrink-0 ml-2">
                      {timeAgo(conv.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a6e4a] truncate mt-0.5">
                    {conv.type === 'group'
                      ? `${conv.participants.length} members`
                      : 'start chatting'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
