import { type FC, Suspense, lazy, memo } from 'preact/compat'

const CreateChatAsync: FC = (props) => {
  const CreateChat = lazy(() => import('./CreateChat'))

  return (
    <Suspense fallback="">
      <CreateChat {...props} />
    </Suspense>
  )
}

export default memo(CreateChatAsync)
