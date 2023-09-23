export const PRIVACY_KEYS = [
  'sendMessage',
  'phoneNumber',
  'lastSeen',
  'profilePhoto',
  'addForwardLink',
  'addByPhone',
  'chatInvite',
] as const
export type ApiPrivacyVisibility = 'Nobody' | 'Everybody' | 'Contacts'

export type ApiPrivacyRule = {
  visibility: ApiPrivacyVisibility
  allowedUsers: string[]
  blockedUsers: string[]
}
export type ApiPrivacyKey = (typeof PRIVACY_KEYS)[number]

export type ApiPrivacy = {
  rule: ApiPrivacyRule
  key: ApiPrivacyKey
}
