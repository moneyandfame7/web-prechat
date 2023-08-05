import type {FC} from 'preact/compat'
import {Suspense, lazy, memo} from 'preact/compat'
import {ScreenLoader} from 'components/ScreenLoader'

const SignUp = lazy(() => import('./SignUp'))

const SignUpAsync: FC = () => {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SignUp />
    </Suspense>
  )
}

export default memo(SignUpAsync)
