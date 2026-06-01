'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { fetchConversations } from '@/lib/chat-api';
import { Sidebar } from './Sidebar';
import { ChatList } from './ChatList';
import { ChatPanel } from './ChatPanel';
import { NewChatDialog } from './NewChatDialog';
import type { Message } from '@/lib/types/chat';

type NavItem = 'home' | 'profile' | 'chats' | 'saved' | 'calendar';

export function ChatLayout() {
  const [activeNav, setActiveNav] = useState<NavItem>('chats');
  const [showNewChat, setShowNewChat] = useState(false);
  const login = useAuthStore((s) => s.login);
  const userId = useAuthStore((s) => s.userId);
  const userInitial = (login?.[0] ?? '?').toUpperCase();

  const setConversations = useChatStore((s) => s.setConversations);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const addOnlineUser = useChatStore((s) => s.addOnlineUser);
  const removeOnlineUser = useChatStore((s) => s.removeOnlineUser);
  const setTyping = useChatStore((s) => s.setTyping);
  const addConversation = useChatStore((s) => s.addConversation);

  // Load conversations + connect socket
  useEffect(() => {
    if (!userId) return;

    fetchConversations()
      .then(setConversations)
      .catch(() => {});

    connectSocket();
    const socket = getSocket();

    socket.on('message:new', (msg: Message) => {
      addMessage(msg);
    });

    socket.on('message:updated', (data: { messageId: string; content: string }) => {
      updateMessage(data.messageId, data.content);
    });

    socket.on('message:deleted', (data: { messageId: string; conversationId: string }) => {
      removeMessage(data.messageId, data.conversationId);
    });

    socket.on('presence:changed', (data: { userId: string; status: string }) => {
      if (data.status === 'online') addOnlineUser(data.userId);
      else removeOnlineUser(data.userId);
    });

    socket.on(
      'typing:update',
      (data: { conversationId: string; userId: string; isTyping: boolean }) => {
        if (data.userId !== userId) {
          setTyping(data.conversationId, data.userId, data.isTyping);
        }
      },
    );

    socket.on('conversation:created', (conv) => {
      addConversation(conv);
    });

    return () => {
      disconnectSocket();
    };
  }, [
    userId,
    setConversations,
    addMessage,
    updateMessage,
    removeMessage,
    addOnlineUser,
    removeOnlineUser,
    setTyping,
    addConversation,
  ]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080d08]">
      <Sidebar active={activeNav} userInitial={userInitial} onNav={setActiveNav} />
      <ChatList onNewChat={() => setShowNewChat(true)} />
      <ChatPanel />
      {showNewChat && <NewChatDialog onClose={() => setShowNewChat(false)} />}
    </div>
  );
}
