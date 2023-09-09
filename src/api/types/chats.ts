import type {ApiColorVariant, ApiUser} from '.'
import type {ApiPhoto} from './diff'

export type ApiChatType = 'chatTypePrivate' | 'chatTypeGroup' | 'chatTypeChannel'

export interface ApiChat {
  id: string
  userId?: string
  type: ApiChatType
  title: string
  color: ApiColorVariant
  inviteLink?: string
  membersCount?: number
  unreadCount?: number
  isNotJoined?: boolean
  isForbidden?: boolean
  isSupport?: boolean
  isOwner: boolean
  isPinned?: boolean
  photo?: ApiPhoto
  // color:
  // lastMessage?: any
  createdAt: Date
  _id: string
}

export type ApiPeer = ApiChat | ApiUser

export interface ApiChatFullInfo {
  members?: ApiChatMember[]
  onlineCount?: number
  description?: string
  areMembersHidden?: boolean
  permissions: ApiChatPermissions
}

export interface ApiChatMember {
  userId: string
  inviterId?: string
  promotedByUserId?: string
  kickedByUserId?: string
  adminRights?: string
  customTitle?: string
  isAdmin?: true
  isOwner?: true
  currentUserPermissions?: ApiChatPermissions
}

export interface ApiChatPermissions {
  canSendMessages: boolean
  canSendMedia: boolean
  canInviteUsers: boolean
  canPinMessages: boolean
  canChangeInfo: boolean
}
export interface ApiChatSettings {
  canAddContact?: boolean
  canReportSpam?: boolean
  canBlockContact?: boolean
  canShareContact?: boolean
}

export interface ChatInput {
  chatId: string
}

export interface CreateChannelInput {
  users?: string[]
  description?: string
  title: string
}

export interface CreateGroupInput {
  users?: string[]
  title: string
}
