import { type FC, Suspense, lazy, memo } from 'preact/compat'

const AuthPasswordAsync: FC = () => {
  const AuthPassword = lazy(() => import('./AuthPassword'))

  return (
    <Suspense fallback="LOADING...">
      <AuthPassword />
    </Suspense>
  )
}

export default memo(AuthPasswordAsync)
