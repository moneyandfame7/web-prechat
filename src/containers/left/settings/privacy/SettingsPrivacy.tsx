import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {type ApiPrivacyKey, PRIVACY_KEYS} from 'api/types'

import type {LanguagePackKeys} from 'types/lib'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {ListItem} from 'components/ui/ListItem'

const translateKey: Record<ApiPrivacyKey, LanguagePackKeys> = {
  addByPhone: 'Privacy.WhoCanAddByPhone',
  addForwardLink: 'Privacy.WhoCanAddForwardLink',
  chatInvite: 'Privacy.WhoCanInvite',
  lastSeen: 'Privacy.WhoCanSeeLastSeen',
  phoneNumber: 'Privacy.WhoCanSeePhone',
  profilePhoto: 'Privacy.WhoCanSeePhoto',
  sendMessage: 'Privacy.WhoCanSendMessage',
}
const SettingsPrivacy: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title="Privacy" onGoBack={resetScreen}>
      <ColumnSection>
        <ListItem icon="deleteUser" title="Blocked Users" right="123" />
        <ListItem icon="key" title="Passcode Lock" subtitle="Off" />
        <ListItem icon="lock" title="Two-Step Verification" subtitle="Off" />
      </ColumnSection>

      <ColumnSection>
        {PRIVACY_KEYS.map((key) => (
          <ListItem key={key}></ListItem>
        ))}
      </ColumnSection>
    </ColumnWrapper>
  )
}

export default memo(SettingsPrivacy)
