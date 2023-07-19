import {type FC, memo, lazy, Suspense} from 'preact/compat'
import {ScreenLoader} from 'components/ScreenLoader'

import type {CreateChatStep1Props} from './CreateChatStep1'

const CreateChatStep1Async: FC<CreateChatStep1Props> = (props) => {
  const CreateChatStep1 = lazy(() => import('./CreateChatStep1'))
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CreateChatStep1 {...props} />
    </Suspense>
  )
}

export default memo(CreateChatStep1Async)
