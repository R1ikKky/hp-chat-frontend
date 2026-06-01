'use client';
import { useState } from 'react';
import { createConversation, searchUsers } from '@/lib/chat-api';
import { useChatStore } from '@/store/chat.store';
import type { ConversationType } from '@/lib/types/chat';

interface NewChatDialogProps {
  onClose: () => void;
}

export function NewChatDialog({ onClose }: NewChatDialogProps) {
  const [mode, setMode] = useState<ConversationType>('direct');
  const [groupName, setGroupName] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; login: string }[]>([]);
  const [selected, setSelected] = useState<{ id: string; login: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const addConversation = useChatStore((s) => s.addConversation);
  const setActive = useChatStore((s) => s.setActiveConversation);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    try {
      const users = await searchUsers(q);
      setResults(users.filter((u) => !selected.some((s) => s.id === u.id)));
    } catch {
      setResults([]);
    }
  }

  function toggleUser(user: { id: string; login: string }) {
    if (selected.some((s) => s.id === user.id)) {
      setSelected(selected.filter((s) => s.id !== user.id));
    } else {
      if (mode === 'direct') {
        setSelected([user]);
      } else {
        setSelected([...selected, user]);
      }
    }
  }

  async function handleCreate() {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const conv = await createConversation({
        type: mode,
        name: mode === 'group' ? groupName || undefined : undefined,
        participantIds: selected.map((s) => s.id),
      });
      addConversation(conv);
      setActive(conv.id);
      onClose();
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-[#0a160a] border border-[#1e2e1e] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#e2fce4]">new conversation</h2>
          <button
            onClick={onClose}
            className="text-[#4a6e4a] hover:text-[#e2fce4] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          {(['direct', 'group'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setSelected([]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mode === m
                  ? 'bg-[#22c55e] text-black'
                  : 'text-[#4a6e4a] bg-[#111a12] hover:text-[#e2fce4]'
              }`}
            >
              {m === 'direct' ? 'direct message' : 'group chat'}
            </button>
          ))}
        </div>

        {/* Group name */}
        {mode === 'group' && (
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="group name (optional)"
            className="w-full mb-3 px-3 py-2 rounded-lg bg-[#111a12] border border-[#1e2e1e] text-sm text-[#e2fce4] placeholder-[#3a5a3a] outline-none"
          />
        )}

        {/* User search */}
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="search users..."
          className="w-full px-3 py-2 rounded-lg bg-[#111a12] border border-[#1e2e1e] text-sm text-[#e2fce4] placeholder-[#3a5a3a] outline-none"
        />

        {/* Selected */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {selected.map((u) => (
              <span
                key={u.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1a2d1a] text-xs text-[#22c55e]"
              >
                {u.login}
                <button onClick={() => toggleUser(u)} className="hover:text-red-400">
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="mt-3 max-h-48 overflow-y-auto">
          {results.map((user) => (
            <button
              key={user.id}
              onClick={() => toggleUser(user)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#111a12] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#1a2d1a] flex items-center justify-center text-[#22c55e] text-xs font-bold">
                {user.login[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-sm text-[#e2fce4]">{user.login}</span>
            </button>
          ))}
        </div>

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={selected.length === 0 || loading}
          className="w-full mt-4 py-2.5 rounded-lg bg-[#22c55e] text-black text-sm font-medium hover:bg-[#16a34a] transition-colors disabled:opacity-40"
        >
          {loading ? 'creating...' : 'start conversation'}
        </button>
      </div>
    </div>
  );
}
