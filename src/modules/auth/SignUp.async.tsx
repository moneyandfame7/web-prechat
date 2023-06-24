import { FC, Suspense, lazy, memo } from 'preact/compat'

const SignUpAsync: FC = () => {
  const SignUp = lazy(() => import('./SignUp'))

  return (
    <Suspense fallback="Loading...">
      <SignUp />
    </Suspense>
  )
}

export default memo(SignUpAsync)
