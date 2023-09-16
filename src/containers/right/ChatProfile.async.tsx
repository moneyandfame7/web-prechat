import {type FC, Suspense, lazy, memo} from 'preact/compat'

import type {ChatProfileProps} from './ChatProfile'

const ChatProfileAsync: FC<ChatProfileProps> = (props) => {
  const ChatProfile = lazy(() => import('./ChatProfile'))

  return (
    <Suspense fallback={undefined}>
      <ChatProfile {...props} />
    </Suspense>
  )
}

export default memo(ChatProfileAsync)
