import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import {ScreenLoader} from 'components/ScreenLoader'

import type {ChatProfileProps} from './ChatProfile'

const ChatProfileAsync: FC<ChatProfileProps> = (props) => {
  const ChatProfile = useLazyComponent('ChatProfile')

  return ChatProfile ? <ChatProfile {...props} /> : <ScreenLoader />
}

export default memo(ChatProfileAsync)
