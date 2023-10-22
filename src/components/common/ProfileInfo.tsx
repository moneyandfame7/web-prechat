import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat, ApiChatFull, ApiUser} from 'api/types'

import {type MapState, connect} from 'state/connect'

import {TEST_translate} from 'lib/i18n'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ProfileAvatar} from 'components/ProfileAvatar'
import {ListItem} from 'components/ui/ListItem'

import './ProfileInfo.scss'

interface OwnProps {
  chat?: ApiChat
  chatFull?: ApiChatFull
  user?: ApiUser
}
interface StateProps {
  isSavedMessages?: boolean
}

const ProfileInfoImpl: FC<OwnProps & StateProps> = ({
  user,
  chat,
  chatFull,
  isSavedMessages,
}) => {
  const buildedClass = clsx('profile-info', {
    'is-me': isSavedMessages,
  })
  const shouldRenderInfo = user?.bio || chatFull?.description
  const shouldRenderPhone = !!user?.phoneNumber
  const shouldRenderUsername = !!user?.username
  function renderInfo() {
    const info = user ? user.bio : chatFull?.description
    return (
      /**
       * @todo remove slice, only for test
       */
      <ListItem icon="info2" subtitle={user ? 'Bio' : 'Info'} title={info?.slice(0, 70)} />
    )
  }

  return (
    <div class={buildedClass}>
      {(user || chat) && <ProfileAvatar peer={(user || chat)!} />}
      <ColumnSection>
        {shouldRenderInfo && renderInfo()}
        {shouldRenderPhone && (
          <ListItem
            icon="phone"
            title={user.phoneNumber}
            subtitle={TEST_translate('PhoneNumber')}
          />
        )}
        {shouldRenderUsername && (
          <ListItem
            icon="username"
            title={user.username}
            subtitle={TEST_translate('Username')}
          />
        )}
      </ColumnSection>
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (_, ownProps) => {
  return {
    isSavedMessages: ownProps.user?.isSelf,
  }
}

export const ProfileInfo = memo(connect(mapStateToProps)(ProfileInfoImpl))
