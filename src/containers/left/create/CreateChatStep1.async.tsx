import {type FC, memo, lazy, Suspense} from 'preact/compat'
// import {ScreenLoader} from 'components/ScreenLoader'

import type {CreateChatStep1Props} from './CreateChatStep1'
// import {useForceUpdate} from 'hooks/useForceUpdate'

const CreateChatStep1Async: FC<CreateChatStep1Props> = (props) => {
  const CreateChatStep1 = lazy(() => import('./CreateChatStep1'))

  // console.log('RERENDER :)))))')
  return (
    <Suspense fallback={undefined}>
      <CreateChatStep1 {...props} />
    </Suspense>
  )
}

export default memo(CreateChatStep1Async)
