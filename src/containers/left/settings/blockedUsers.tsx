import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {connect} from 'state/connect'

import {TEST_translate} from 'lib/i18n'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {FloatButton, Icon} from 'components/ui'

import {ColumnSection} from '../ColumnSection'

interface StateProps {
  blockedIds: string[]
}
const BlockedUsersImpl: FC<StateProps> = ({blockedIds}) => {
  const {resetScreen} = SettingsContext.useScreenContext()
  const s = 1
  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('Settings.BlockedUsers')}>
      <p class="text-secondary text-small pl-20 pr-20 pb-10 pt-10">
        {TEST_translate('Settings.BlockedUsersInfo')}
      </p>

      <ColumnSection>
        {Array.from({length: 10}).map((v, i) => (
          <h1 key={i}>{i}</h1>
        ))}
      </ColumnSection>
      <FloatButton shown icon={<Icon name="plus" />} />
    </ColumnWrapper>
  )
}

export const BlockedUsers = memo(
  connect(
    (state): StateProps => ({
      blockedIds: state.blocked.ids,
    })
  )(BlockedUsersImpl)
)
