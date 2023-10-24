import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import {ScreenLoader} from 'components/ScreenLoader'

import type {ChatEditProps} from './ChatEdit'

const ChatEditAsync: FC<ChatEditProps> = (props) => {
  const ChatEdit = useLazyComponent('ChatEdit')

  return ChatEdit ? <ChatEdit {...props} /> : <ScreenLoader />
}

export default memo(ChatEditAsync)
