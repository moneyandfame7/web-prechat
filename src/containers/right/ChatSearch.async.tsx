import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import {ScreenLoader} from 'components/ScreenLoader'

import type {ChatSearchProps} from './ChatSearch'

const ChatSearchAsync: FC<ChatSearchProps> = (props) => {
  const ChatSearch = useLazyComponent('ChatSearch')

  return ChatSearch ? <ChatSearch {...props} /> : <ScreenLoader />
}

export default memo(ChatSearchAsync)
