'use client';
import { create } from 'zustand';
import type { Conversation, Message } from '@/lib/types/chat';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  onlineUsers: string[];
  typingUsers: Record<string, string[]>;

  setConversations: (convs: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conv: Conversation) => void;

  setMessages: (conversationId: string, msgs: Message[]) => void;
  prependMessages: (conversationId: string, msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  updateMessage: (messageId: string, content: string) => void;
  removeMessage: (messageId: string, conversationId: string) => void;

  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;

  setTyping: (
    conversationId: string,
    userId: string,
    isTyping: boolean,
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  onlineUsers: [],
  typingUsers: {},

  setConversations: (convs) => set({ conversations: convs }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addConversation: (conv) =>
    set((s) => ({ conversations: [conv, ...s.conversations] })),

  setMessages: (conversationId, msgs) =>
    set((s) => ({ messages: { ...s.messages, [conversationId]: msgs } })),

  prependMessages: (conversationId, msgs) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [
          ...msgs,
          ...(s.messages[conversationId] ?? []),
        ],
      },
    })),

  addMessage: (msg) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [msg.conversationId]: [
          ...(s.messages[msg.conversationId] ?? []),
          msg,
        ],
      },
    })),

  updateMessage: (messageId, content) =>
    set((s) => {
      const updated: Record<string, Message[]> = {};
      for (const [convId, msgs] of Object.entries(s.messages)) {
        updated[convId] = msgs.map((m) =>
          m.id === messageId
            ? { ...m, content, isEdited: true, editedAt: new Date().toISOString() }
            : m,
        );
      }
      return { messages: updated };
    }),

  removeMessage: (messageId, conversationId) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: (s.messages[conversationId] ?? []).map((m) =>
          m.id === messageId ? { ...m, isDeleted: true, content: '' } : m,
        ),
      },
    })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (userId) =>
    set((s) =>
      s.onlineUsers.includes(userId)
        ? s
        : { onlineUsers: [...s.onlineUsers, userId] },
    ),

  removeOnlineUser: (userId) =>
    set((s) => ({
      onlineUsers: s.onlineUsers.filter((u) => u !== userId),
    })),

  setTyping: (conversationId, userId, isTyping) =>
    set((s) => {
      const current = s.typingUsers[conversationId] ?? [];
      const next = isTyping
        ? current.includes(userId)
          ? current
          : [...current, userId]
        : current.filter((u) => u !== userId);
      return { typingUsers: { ...s.typingUsers, [conversationId]: next } };
    }),
}));
