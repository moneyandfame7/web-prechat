import {type FC, Suspense, lazy, memo} from 'preact/compat'

// import {ScreenLoader} from 'components/ScreenLoader'
import type {ChatEditProps} from './ChatEdit'

// import {useForceUpdate} from 'hooks/useForceUpdate'

const ChatEditAsync: FC<ChatEditProps> = (props) => {
  const ChatEdit = lazy(() => import('./ChatEdit'))

  // console.log('RERENDER :)))))')
  return (
    <Suspense fallback={undefined}>
      <ChatEdit {...props} />
    </Suspense>
  )
}

export default memo(ChatEditAsync)
