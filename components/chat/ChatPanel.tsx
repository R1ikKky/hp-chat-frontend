'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import { fetchMessages } from '@/lib/chat-api';
import { getSocket } from '@/lib/socket';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { PaginatedMessages } from '@/lib/types/chat';

export function ChatPanel() {
  const activeId = useChatStore((s) => s.activeConversationId);
  const messages = useChatStore((s) => (activeId ? s.messages[activeId] : undefined));
  const setMessages = useChatStore((s) => s.setMessages);
  const prependMessages = useChatStore((s) => s.prependMessages);
  const typingUsers = useChatStore((s) => (activeId ? s.typingUsers[activeId] : undefined));
  const conversations = useChatStore((s) => s.conversations);
  const userId = useAuthStore((s) => s.userId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<string | null>(null);
  const hasNextRef = useRef(true);
  const loadingRef = useRef(false);

  const activeConv = conversations.find((c) => c.id === activeId);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeId) return;

    cursorRef.current = null;
    hasNextRef.current = true;

    fetchMessages(activeId)
      .then((res: PaginatedMessages) => {
        setMessages(activeId, [...res.data].reverse());
        cursorRef.current = res.nextCursor;
        hasNextRef.current = res.hasNext;
        setTimeout(() => bottomRef.current?.scrollIntoView(), 50);
      })
      .catch(() => {});

    const socket = getSocket();
    socket.emit('message:read', { conversationId: activeId });
  }, [activeId, setMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const el = scrollRef.current;
      if (!el) return;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      if (isNearBottom) {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    }
  }, [messages?.length]);

  // Infinite scroll up for older messages
  const handleScroll = useCallback(() => {
    if (!activeId || !hasNextRef.current || loadingRef.current) return;
    const el = scrollRef.current;
    if (!el || el.scrollTop > 100) return;

    loadingRef.current = true;
    const prevHeight = el.scrollHeight;

    fetchMessages(activeId, cursorRef.current ?? undefined)
      .then((res: PaginatedMessages) => {
        prependMessages(activeId, [...res.data].reverse());
        cursorRef.current = res.nextCursor;
        hasNextRef.current = res.hasNext;
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight - prevHeight;
        });
      })
      .catch(() => {})
      .finally(() => {
        loadingRef.current = false;
      });
  }, [activeId, prependMessages]);

  function handleEdit(messageId: string, content: string) {
    const socket = getSocket();
    socket.emit('message:edit', { messageId, content });
  }

  function handleDelete(messageId: string) {
    const socket = getSocket();
    socket.emit('message:delete', { messageId });
  }

  if (!activeId || !activeConv) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-[#080d08] text-center px-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0d1410] border border-[#1e2e1e] text-[#1e3520]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" y1="10" x2="15" y2="10" />
            <line x1="9" y1="14" x2="13" y2="14" />
          </svg>
        </div>
        <div>
          <p className="text-[#4a6e4a] font-medium text-sm">select a chat to start</p>
          <p className="text-[#2a4a2a] text-xs mt-1">your messages will appear here</p>
        </div>
      </div>
    );
  }

  const convName =
    activeConv.name ??
    (activeConv.type === 'direct'
      ? activeConv.participants.find((p) => p.userId !== userId)?.userId.slice(0, 8) ?? 'chat'
      : 'group');

  return (
    <div className="flex flex-col flex-1 bg-[#080d08]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1e2e1e] bg-[#0a160a]">
        <div className="w-9 h-9 rounded-full bg-[#1a2d1a] flex items-center justify-center text-[#22c55e] text-sm font-bold">
          {(convName[0] ?? '?').toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-[#e2fce4]">{convName}</p>
          <p className="text-[10px] text-[#4a6e4a]">
            {activeConv.participants.length} participant{activeConv.participants.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
      >
        {(!messages || messages.length === 0) && (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-[#3a5a3a]">no messages yet — say something</p>
          </div>
        )}
        {messages?.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.senderId === userId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers && typingUsers.length > 0 && (
        <div className="px-5 pb-1 text-[10px] text-[#4a6e4a]">
          {typingUsers.length === 1
            ? `${typingUsers[0].slice(0, 8)} is typing...`
            : `${typingUsers.length} people typing...`}
        </div>
      )}

      <MessageInput conversationId={activeId} />
    </div>
  );
}
