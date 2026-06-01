'use client';
import { useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState('');
  const typingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleTyping() {
    const socket = getSocket();
    if (!typingRef.current) {
      typingRef.current = true;
      socket.emit('typing:start', { conversationId });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingRef.current = false;
      socket.emit('typing:stop', { conversationId });
    }, 2000);
  }

  function handleSend() {
    const content = text.trim();
    if (!content) return;

    const socket = getSocket();
    socket.emit('message:send', { conversationId, content, type: 'text' });
    setText('');

    if (typingRef.current) {
      typingRef.current = false;
      clearTimeout(typingTimeoutRef.current);
      socket.emit('typing:stop', { conversationId });
    }
  }

  return (
    <div className="flex items-end gap-2 px-4 py-3 border-t border-[#1e2e1e] bg-[#0a160a]">
      <div className="flex-1 flex items-end bg-[#111a12] border border-[#1e2e1e] rounded-xl px-3 py-2">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="type a message..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-[#e2fce4] placeholder-[#3a5a3a] outline-none resize-none max-h-32"
          style={{ minHeight: '20px' }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#22c55e] text-black hover:bg-[#16a34a] transition-colors disabled:opacity-30 disabled:hover:bg-[#22c55e] shrink-0"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
