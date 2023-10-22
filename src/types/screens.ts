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
  BlockedUsers,
  /* PRIVACY--TWO FA */

  PrivacyActiveSessions,
  PrivacyPhone,
  PrivacyLastSeen,
  PrivacyProfilePhoto,
  PrivacyAddForwardLink,
  PrivacyAddByPhone,
  PrivacyChatInvite,
  PrivacySendMessage,
  PrivacyRuleSection,

  General,
  Wallpapers,

  /* CHAT FOLDERS */
  ChatFolders,
  ChatFoldersEdit,
  ChatFoldersNew,
  ChatFoldersNewIncludes,
  ChatFoldersNewExcludes,

  Devices,
  Language,

  /* Two Fa */
  TwoFa,
  TwoFaEnterPassword,
  TwoFaReEnterPassword,
  TwoFaPasswordHint,
  TwoFaEmail,
  TwoFaEmailConfirmation,
  TwoFaPasswordSet,
}

export enum RightColumnScreens {
  ChatProfile,
  ChatEdit,
  Search,
  // EditContact,
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

/**
 * It's not really a "screen"
 */
export enum ChatProfileScreens {
  Profile,
  Members,
  SharedMedia,
}

export enum SettingsGroup {
  Main,
  EditProfile,
  Notifications,
  DataAndStorage,
  Privacy,
  BlockedUsers,
  General,
  ChatFolders,
  ChatFoldersEdit,
  Devices,
  Language,
  TwoFa,
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
  [SettingsGroup.ChatFolders]: [SettingsScreens.ChatFolders],
  [SettingsGroup.ChatFoldersEdit]: [SettingsScreens.ChatFoldersEdit],
  [SettingsGroup.Devices]: [SettingsScreens.Devices],

  [SettingsGroup.Language]: [SettingsScreens.Language],
  [SettingsGroup.BlockedUsers]: [SettingsScreens.BlockedUsers],
  [SettingsGroup.TwoFa]: [
    SettingsScreens.TwoFaEnterPassword,
    SettingsScreens.TwoFaReEnterPassword,
    SettingsScreens.TwoFaPasswordHint,
    SettingsScreens.TwoFaEmail,
    SettingsScreens.TwoFaEmailConfirmation,
    SettingsScreens.TwoFaPasswordSet,
  ],
}

export const getSettingsActiveGroup = (screen: SettingsScreens): SettingsGroup => {
  for (const [group, screens] of Object.entries(SETTINGS_SCREENS)) {
    if (screens.includes(screen)) {
      return Number(group) as SettingsGroup
    }
  }
  return SettingsGroup.Main
}

export const isTwoFaScreen = (screen: SettingsScreens) =>
  SETTINGS_SCREENS[SettingsGroup.TwoFa].includes(screen)
