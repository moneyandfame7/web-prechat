import type {FC, PropsWithChildren} from 'preact/compat'

import {VirtualScroll} from './VirtualScroll'

const ChatListTest: FC<PropsWithChildren> = ({children}) => {
  return <VirtualScroll>{children}</VirtualScroll>
}

export {ChatListTest}
