import {type FC, Suspense, lazy, memo} from 'preact/compat'
import {ScreenLoader} from 'components/ScreenLoader'

const AuthPassword = lazy(() => import('./AuthPassword'))

const AuthPasswordAsync: FC = () => {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <AuthPassword />
    </Suspense>
  )
}

export default memo(AuthPasswordAsync)
