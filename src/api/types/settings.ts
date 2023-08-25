export type ApiPrivacyKey =
  | 'phoneNumber'
  | 'lastSeen'
  | 'profilePhoto'
  | 'addForwardLink'
  | 'addByPhone'
  | 'chatInvite'
export type ApiPrivacyVisibility = 'Nobody' | 'Everybody' | 'Contacts'

export type ApiPrivacyRule = {
  visibility: ApiPrivacyVisibility
  allowedUsers: string[]
  blockedUsers: string[]
}

export type ApiPrivacy = {
  rule: ApiPrivacyRule
  key: ApiPrivacyKey
}

export const SETTINGS_SECTION = [
  'Notifications and Sounds',
  'Data and Storage',
  'Privacy and Security',
  'General Settings',
  'Chat Folders',
  'Devices',
  'Language',
] as const

export type SettingsSection = (typeof SETTINGS_SECTION)[number]
