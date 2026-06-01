import { api } from './api';
import type {
  Conversation,
  ConversationType,
  Message,
  PaginatedMessages,
} from './types/chat';

// ── Conversations ──

export async function fetchConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>('/conversations');
  return data;
}

export async function fetchConversation(id: string): Promise<Conversation> {
  const { data } = await api.get<Conversation>(`/conversations/${id}`);
  return data;
}

export async function createConversation(payload: {
  type: ConversationType;
  name?: string;
  participantIds: string[];
}): Promise<Conversation> {
  const { data } = await api.post<Conversation>('/conversations', payload);
  return data;
}

export async function updateConversation(
  id: string,
  payload: { name?: string; avatarUrl?: string },
): Promise<Conversation> {
  const { data } = await api.patch<Conversation>(
    `/conversations/${id}`,
    payload,
  );
  return data;
}

export async function addMember(
  conversationId: string,
  userId: string,
): Promise<void> {
  await api.post(`/conversations/${conversationId}/members`, { userId });
}

export async function removeMember(
  conversationId: string,
  memberId: string,
): Promise<void> {
  await api.delete(`/conversations/${conversationId}/members/${memberId}`);
}

export async function leaveConversation(id: string): Promise<void> {
  await api.delete(`/conversations/${id}`);
}

// ── Messages ──

export async function fetchMessages(
  conversationId: string,
  cursor?: string,
  limit = 50,
): Promise<PaginatedMessages> {
  const params: Record<string, string | number> = { limit };
  if (cursor) params.cursor = cursor;
  const { data } = await api.get<PaginatedMessages>(
    `/messages/${conversationId}`,
    { params },
  );
  return data;
}

export async function sendMessageRest(
  conversationId: string,
  payload: { content: string; type?: string; replyTo?: string },
): Promise<Message> {
  const { data } = await api.post<Message>(
    `/messages/${conversationId}`,
    payload,
  );
  return data;
}

export async function editMessageApi(
  messageId: string,
  content: string,
): Promise<Message> {
  const { data } = await api.patch<Message>(`/messages/${messageId}`, {
    content,
  });
  return data;
}

export async function deleteMessageApi(messageId: string): Promise<Message> {
  const { data } = await api.delete<Message>(`/messages/${messageId}`);
  return data;
}

// ── Users (search for new chat) ──

export async function searchUsers(
  query: string,
): Promise<{ id: string; login: string }[]> {
  const { data } = await api.get<{ id: string; login: string }[]>(
    '/users/search',
    { params: { q: query } },
  );
  return data;
}
