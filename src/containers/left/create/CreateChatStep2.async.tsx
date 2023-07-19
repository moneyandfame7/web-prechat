import {type FC, memo, lazy, Suspense} from 'preact/compat'
import {ScreenLoader} from 'components/ScreenLoader'

import type {CreateChatStep2Props} from './CreateChatStep2'

const CreateChatStep2Async: FC<CreateChatStep2Props> = (props) => {
  const CreateChatStep2 = lazy(() => import('./CreateChatStep2'))
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CreateChatStep2 {...props} />
    </Suspense>
  )
}

export default memo(CreateChatStep2Async)
