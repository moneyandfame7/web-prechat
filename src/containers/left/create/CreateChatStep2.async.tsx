import {type FC, Suspense, lazy, memo} from 'preact/compat'

import type {CreateChatStep2Props} from './CreateChatStep2'

const CreateChatStep2Async: FC<CreateChatStep2Props> = (props) => {
  const CreateChatStep2 = lazy(() => import('./CreateChatStep2'))
  return (
    <Suspense fallback={null}>
      <CreateChatStep2 {...props} />
    </Suspense>
  )
}

export default memo(CreateChatStep2Async)
