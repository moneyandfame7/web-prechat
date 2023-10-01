import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SignUp = lazy(() => import('./SignUp'))

const SignUpAsync: FC = () => {
  return (
    <Suspense fallback={null}>
      <SignUp />
    </Suspense>
  )
}

export default memo(SignUpAsync)
