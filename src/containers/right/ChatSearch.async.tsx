import {type FC, Suspense, lazy, memo} from 'preact/compat'

import type {ChatSearchProps} from './ChatSearch'

const ChatSearchAsync: FC<ChatSearchProps> = (props) => {
  const ChatSearch = lazy(() => import('./ChatSearch'))

  return (
    <Suspense fallback={undefined}>
      <ChatSearch {...props} />
    </Suspense>
  )
}

export default memo(ChatSearchAsync)
