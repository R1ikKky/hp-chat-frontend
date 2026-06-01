export type ConversationType = 'direct' | 'group';
export type ParticipantRole = 'owner' | 'admin' | 'member';
export type MessageType = 'text' | 'file' | 'image' | 'system';

export interface Participant {
  id: string;
  conversationId: string;
  userId: string;
  role: ParticipantRole;
  joinedAt: string;
  lastReadAt: string | null;
  mutedUntil: string | null;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string | null;
  avatarUrl: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  replyTo: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  sentAt: string;
  editedAt: string | null;
  attachments: MessageAttachment[];
}

export interface PaginatedMessages {
  data: Message[];
  hasNext: boolean;
  nextCursor: string | null;
}
