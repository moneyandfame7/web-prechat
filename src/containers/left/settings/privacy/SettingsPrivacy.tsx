import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {type ApiPrivacyKey, PRIVACY_KEYS} from 'api/types'

import {connect} from 'state/connect'

import {useBoolean} from 'hooks/useFlag'

import {TEST_translate} from 'lib/i18n'

import {MOCK_TWO_FA} from 'common/app'

import {SettingsScreens} from 'types/screens'
import {TwoFaState} from 'types/state'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import ConfirmModal from 'components/popups/ConfirmModal.async'
import {ListItem} from 'components/ui/ListItem'

const translateKey = {
  addByPhone: 'Privacy.WhoCanAddByPhone',
  addForwardLink: 'Privacy.WhoCanAddForwardLink',
  chatInvite: 'Privacy.WhoCanInvite',
  lastSeen: 'Privacy.WhoCanSeeLastSeen',
  phoneNumber: 'Privacy.WhoCanSeePhone',
  profilePhoto: 'Privacy.WhoCanSeePhoto',
  sendMessage: 'Privacy.WhoCanSendMessage',
  bio: 'Privacy.WhoCanSeeBio',
} as const

const screensByKey = {
  addByPhone: SettingsScreens.PrivacyAddByPhone,
  addForwardLink: SettingsScreens.PrivacyAddForwardLink,
  chatInvite: SettingsScreens.PrivacyChatInvite,
  lastSeen: SettingsScreens.PrivacyLastSeen,
  phoneNumber: SettingsScreens.PrivacyPhone,
  profilePhoto: SettingsScreens.PrivacyProfilePhoto,
  sendMessage: SettingsScreens.PrivacySendMessage,
} satisfies Record<ApiPrivacyKey, SettingsScreens>

const SettingsPrivacy: FC = () => {
  const {resetScreen, setScreen} = SettingsContext.useScreenContext()

  const {value: isConfirmOpen, setFalse: closeFonfirm, setTrue: openConfirm} = useBoolean()

  return (
    <ColumnWrapper title={TEST_translate('Settings.Privacy')} onGoBack={resetScreen}>
      <ColumnSection>
        <ListItem
          onClick={() => {
            setScreen(SettingsScreens.BlockedUsers)
          }}
          icon="deleteUser"
          title="Blocked Users"
          right="123"
        />
        <ListItem icon="key" title="Passcode Lock" subtitle="Off" />
        <ListItem
          onClick={() => {
            setScreen(
              MOCK_TWO_FA.value ? SettingsScreens.TwoFaEnterPassword : SettingsScreens.TwoFa
            )
          }}
          icon="lock"
          title="Two-Step Verification"
          subtitle="Off"
        />
      </ColumnSection>

      <ColumnSection title={TEST_translate('Privacy')}>
        {PRIVACY_KEYS.map((key) => (
          <ListItem
            onClick={() => {
              setScreen(screensByKey[key])
            }}
            key={key}
            title={TEST_translate(translateKey[key])}
            subtitle={TEST_translate('Privacy.Everybody')}
          />
        ))}
      </ColumnSection>

      <ColumnSection title={TEST_translate('Chats')}>
        <ListItem
          icon="delete"
          title={TEST_translate('Privacy.DeleteDrafts')}
          onClick={openConfirm}
        />
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={closeFonfirm}
          action={TEST_translate('Delete')}
          title={TEST_translate('Privacy.DeleteDraftsTitle')}
          content={TEST_translate('Privacy.DeleteDraftsAreYouSure')}
          callback={closeFonfirm}
        />
      </ColumnSection>
    </ColumnWrapper>
  )
}

export default memo(SettingsPrivacy)
