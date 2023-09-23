import {type FC, Suspense, lazy, memo} from 'preact/compat'

const AuthPassword = lazy(() => import('./AuthPassword'))

const AuthPasswordAsync: FC = () => {
  return (
    <Suspense fallback={null}>
      <AuthPassword />
    </Suspense>
  )
}

export default memo(AuthPasswordAsync)
