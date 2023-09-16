import {type FC, memo} from 'preact/compat'

import clsx from 'clsx'

import type {ApiChat, ApiPeer, ApiUser} from 'api/types'

import {getChatName} from 'state/helpers/chats'
import {getUserName, isUserId} from 'state/helpers/users'

import styles from './FullNameTitle.module.scss'

interface FullNameTitleProps {
  peer: ApiPeer
  isSavedMessages?: boolean
  className?: string
}
export const FullNameTitle: FC<FullNameTitleProps> = memo(
  ({peer, isSavedMessages, className}) => {
    const isUser = isUserId(peer.id)
    const title = isUser ? getUserName(peer as ApiUser) : getChatName(peer as ApiChat)

    function renderTitle() {
      if (isSavedMessages) {
        return 'Saved Messages_translate'
      }

      return title
    }
    return <div class={clsx(className, styles.root)}>{renderTitle()}</div>
  }
)
