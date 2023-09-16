export enum AuthScreens {
  PhoneNumber,
  Password,
  Code,
  SignUp,
}

export enum SettingsScreens {
  Main,
  EditProfile,
  Notifications,
  DataAndStorage,
  /* DataAndStoragePhoto, Video... */

  /* PRIVACY */
  Privacy,
  PrivacyBlockedUsers,

  /* PRIVACY--TWO FA */
  PrivacyTwoFaSetPassword,

  PrivacyActiveSessions,
  PrivacyPhone,
  PrivacyLastSeen,
  PrivacyProfilePhoto,
  PrivacyAddForwardLink,
  PrivacyAddByPhone,
  PrivacyChatInvite,
  PrivacyRuleSection,

  General,
  Appearance,
  AppearanceChatBackground,

  /* CHAT FOLDERS */
  ChatFolders,
  ChatFoldersNew,
  ChatFoldersNewIncludes,
  ChatFoldersNewExcludes,

  Devices,
  Language,
}

export enum RightColumnScreens {
  ChatProfile,
  ChatEdit,
  Search,
}

export enum ChatEditScreens {
  Main,
  ChatType,
  InviteLinks,
  NewLink,
  Admins,
  AdminPermissions,
  UserPermissions,
  Members,
  Permissions,
  RemovedUsers,
}

export enum SettingsGroup {
  Main,
  EditProfile,
  Notifications,
  DataAndStorage,
  Appearance,
  Privacy,
  General,
  ChatFolders,
  Devices,
  Language,
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
    SettingsScreens.PrivacyRuleSection,
  ],
  [SettingsGroup.General]: [SettingsScreens.General],
  [SettingsGroup.ChatFolders]: [
    SettingsScreens.ChatFolders,
    SettingsScreens.ChatFoldersNew,
    SettingsScreens.ChatFoldersNewExcludes,
    SettingsScreens.ChatFoldersNewIncludes,
  ],
  [SettingsGroup.Devices]: [SettingsScreens.Devices],
  [SettingsGroup.Appearance]: [
    SettingsScreens.Appearance,
    SettingsScreens.AppearanceChatBackground,
  ],
  [SettingsGroup.Language]: [SettingsScreens.Language],
}

export const getSettingsActiveGroup = (screen: SettingsScreens): SettingsGroup => {
  for (const [group, screens] of Object.entries(SETTINGS_SCREENS)) {
    if (screens.includes(screen)) {
      return Number(group) as SettingsGroup
    }
  }
  return SettingsGroup.Main
}
