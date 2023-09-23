import {type FC, Suspense, lazy, memo} from 'preact/compat'

import type {CreateChatProps} from './CreateChat'

const CreateChatAsync: FC<CreateChatProps> = (props) => {
  const CreateChat = lazy(() => import('./CreateChat'))

  return (
    <Suspense fallback={null}>
      <CreateChat {...props} />
    </Suspense>
  )
}

export default memo(CreateChatAsync)
