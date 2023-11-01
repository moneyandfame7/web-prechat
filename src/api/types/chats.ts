import type {ApiColorVariant, ApiInputUser, ApiUser} from '.'
import type {ApiPhoto} from './diff'
import type {ApiMessage} from './messages'

export type ApiChatType = 'chatTypePrivate' | 'chatTypeGroup' | 'chatTypeChannel'

export interface ApiChat {
  id: string
  lastReadIncomingMessageId?: number
  lastReadOutgoingMessageId?: number
  userId?: string
  type: ApiChatType
  title: string
  draft?: string
  color: ApiColorVariant
  inviteLink?: string
  membersCount?: number
  lastMessage?: ApiMessage
  unreadCount?: number
  isNotJoined?: boolean
  isForbidden?: boolean
  isSupport?: boolean
  isSavedMessages?: boolean
  isOwner: boolean
  isPinned?: boolean
  isMuted?: boolean
  photo?: ApiPhoto
  // color:
  // lastMessage?: any
  /**
   * @todo rewrite on string
   */
  createdAt: Date
  _id: string
}

export interface ApiChatFolder {
  orderId: number
  icon?: string
  title: string
  contacts?: true
  nonContacts?: true
  groups?: true
  channels?: true
  excludeMuted?: true
  excludeReaded?: true
  excludeArchived?: true
  pinnedChats?: string[]
  includedChats?: string[]
  excludedChats?: string[]
}

export interface ApiInputChat {
  chatId: string
}
export type ApiPeer = ApiChat | ApiUser
export type ApiInputPeer = ApiInputChat | ApiInputUser
export interface ApiChatFull {
  members?: ApiChatMember[]
  onlineCount?: number
  description?: string
  areMembersHidden?: boolean
  historyForNewMembers?: boolean
  // permissions: ApiChatPermissions
  // currentUserPermissions?: ApiChatPermissions
  // currentAdminPermissions?: ApiChatAdminPermissions
  additionalLinks?: ApiInviteLink[]
}

export interface ApiChatMember {
  userId: string
  inviterId?: string
  promotedByUserId?: string
  joinedDate?: Date
  kickedByUserId?: string
  adminRights?: string
  customTitle?: string
  isAdmin?: boolean
  isOwner?: boolean
  /* IF ADMIN - only ADMIN PERMISSIONS, else - only user permissions. */
  // userPermissions?: ApiChatPermissions
  // adminPermissions?: ApiChatAdminPermissions
}
export interface ApiInviteLink {
  name?: string
  usageLimit?: number
  createdAt?: string
  expiredDate?: string
  ownerId: string
  usage?: number
  link: string
  isRevoked?: boolean
  isPermanent?: boolean
}
// export interface ApiChatPermissions {
//   canSendMessages?: boolean
//   canSendMedia?: boolean
//   canInviteUsers?: boolean
//   canPinMessages?: boolean
//   canChangeInfo?: boolean
// }
// export interface ApiChatAdminPermissions {
//   canChangeInfo?: boolean
//   canDeleteMessages?: boolean
//   canBanUsers?: boolean
//   canInviteUsers?: boolean
//   canPinMessages?: boolean
//   canAddNewAdmins?: boolean
// }
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
export interface UpdateChatInput extends ChatInput {
  description?: string
  title?: string
}
