export enum AuthScreens {
  PhoneNumber = 'PhoneNumber',
  Password = 'AuthPassword',
  Code = 'Code',
  SignUp = 'SignUp'
}

export enum SettingsScreens {
  Main = 'Main',
  EditProfile = 'EditProfile',
  Notifications = 'Notifications',
  DataAndStorage = 'DataAndStorage',
  /* DataAndStoragePhoto, Video... */

  /* PRIVACY */
  Privacy = 'Privacy',
  PrivacyBlockedUsers = 'PrivacyBlockedUsers',

  /* PRIVACY--TWO FA */
  PrivacyTwoFaSetPassword = 'PrivacySetPassword',

  PrivacyActiveSessions = 'PrivacyActiveSessions',
  PrivacyPhone = 'PrivacyPhone',
  PrivacyLastSeen = 'PrivacyLastSeen',
  PrivacyProfilePhoto = 'PrivacyProfilePhoto',
  PrivacyAddForwardLink = 'PrivacyAddForwardLink',
  PrivacyAddByPhone = 'PrivacyAddByPhone',
  PrivacyChatInvite = 'PrivacyChatInvite',
  PrivacyRuleSection = 'PrivacyRuleSection',

  General = 'General',
  Appearance = 'Appearance',
  AppearanceChatBackground = 'AppearanceChatBackground',

  /* CHAT FOLDERS */
  ChatFolders = 'ChatFolders',
  ChatFoldersNew = 'ChatFoldersNew',
  ChatFoldersNewIncludes = 'ChatFoldersNewIncludes',
  ChatFoldersNewExcludes = 'ChatFoldersNewExcludes',

  Devices = 'Devices',
  Language = 'Language'
}

export enum SettingsGroup {
  Main = 'Main',
  EditProfile = 'EditProfile',
  Notifications = 'Notifications',
  DataAndStorage = 'DataAndStorage',
  Appearance = 'Appearance',
  Privacy = 'Privacy',
  General = 'General',
  ChatFolders = 'ChatFolders',
  Devices = 'Devices',
  Language = 'Language'
}

export const SETTINGS_SCREENS: Record<SettingsGroup, SettingsScreens[]> = {
  [SettingsGroup.Main]: [SettingsScreens.Main],
  [SettingsGroup.EditProfile]: [SettingsScreens.EditProfile],
  [SettingsGroup.Notifications]: [SettingsScreens.Notifications],
  [SettingsGroup.DataAndStorage]: [SettingsScreens.DataAndStorage],
  [SettingsGroup.Privacy]: [
    SettingsScreens.Privacy,
    SettingsScreens.PrivacyActiveSessions,
    SettingsScreens.PrivacyPhone,
    SettingsScreens.PrivacyLastSeen,
    SettingsScreens.PrivacyProfilePhoto,
    SettingsScreens.PrivacyAddForwardLink,
    SettingsScreens.PrivacyAddByPhone,
    SettingsScreens.PrivacyChatInvite,
    SettingsScreens.PrivacyRuleSection
  ],
  [SettingsGroup.General]: [SettingsScreens.General],
  [SettingsGroup.ChatFolders]: [
    SettingsScreens.ChatFolders,
    SettingsScreens.ChatFoldersNew,
    SettingsScreens.ChatFoldersNewExcludes,
    SettingsScreens.ChatFoldersNewIncludes
  ],
  [SettingsGroup.Devices]: [SettingsScreens.Devices],
  [SettingsGroup.Appearance]: [
    SettingsScreens.Appearance,
    SettingsScreens.AppearanceChatBackground
  ],
  [SettingsGroup.Language]: [SettingsScreens.Language]
}

export const getSettingsActiveGroup = (screen: SettingsScreens): SettingsGroup => {
  for (const [group, screens] of Object.entries(SETTINGS_SCREENS)) {
    if (screens.includes(screen)) {
      return group as SettingsGroup
    }
  }
  return SettingsGroup.Main
}
