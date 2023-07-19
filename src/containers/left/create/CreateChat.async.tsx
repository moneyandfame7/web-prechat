import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

import type {CreateChatProps} from './CreateChat'

const CreateChatAsync: FC<CreateChatProps> = (props) => {
  const CreateChat = lazy(() => import('./CreateChat'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <CreateChat {...props} />
    </Suspense>
  )
}

export default memo(CreateChatAsync)
