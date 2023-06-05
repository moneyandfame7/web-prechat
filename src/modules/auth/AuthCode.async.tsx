import { FC, Suspense, lazy, memo } from 'preact/compat'

const AuthCodeAsync: FC = () => {
  const AuthCode = lazy(() => import('./AuthCode'))

  return (
    <Suspense fallback="Loading...">
      <AuthCode />
    </Suspense>
  )
}

export default memo(AuthCodeAsync)
