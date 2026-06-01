'use client';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types/chat';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({
  message,
  isMine,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  if (message.isDeleted) {
    return (
      <div className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
        <div className="px-3 py-2 rounded-xl text-xs italic text-[#3a5a3a]">
          message deleted
        </div>
      </div>
    );
  }

  if (message.type === 'system') {
    return (
      <div className="flex justify-center">
        <span className="px-3 py-1 text-xs text-[#3a5a3a] bg-[#0d1410] rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  function handleEditSubmit() {
    if (editText.trim() && editText !== message.content) {
      onEdit(message.id, editText.trim());
    }
    setEditing(false);
  }

  return (
    <div
      className={cn('group flex gap-1', isMine ? 'justify-end' : 'justify-start')}
      onMouseLeave={() => setShowMenu(false)}
    >
      {isMine && (
        <div className="relative flex items-start">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#3a5a3a] hover:text-[#e2fce4] p-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 z-10 bg-[#111a12] border border-[#1e2e1e] rounded-lg shadow-lg py-1 min-w-[100px]">
              <button
                onClick={() => {
                  setEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#e2fce4] hover:bg-[#1e2e1e]"
              >
                edit
              </button>
              <button
                onClick={() => {
                  onDelete(message.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-[#1e2e1e]"
              >
                delete
              </button>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          'max-w-[70%] px-3 py-2 rounded-2xl text-sm break-words',
          isMine
            ? 'bg-chat-sent text-white rounded-br-md'
            : 'bg-chat-recv text-[#e2fce4] rounded-bl-md',
        )}
      >
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit();
            }}
          >
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditing(false);
              }}
              autoFocus
              className="w-full bg-transparent outline-none text-sm"
            />
            <div className="flex gap-2 mt-1 text-[10px] text-[#4a6e4a]">
              <button type="submit">save</button>
              <button type="button" onClick={() => setEditing(false)}>
                cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>{message.content}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] opacity-60">
                {formatTime(message.sentAt)}
              </span>
              {message.isEdited && (
                <span className="text-[10px] opacity-40">edited</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
