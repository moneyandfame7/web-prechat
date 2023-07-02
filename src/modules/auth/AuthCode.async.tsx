import { type FC, Suspense, lazy, memo } from 'preact/compat'

const AuthCodeAsync: FC = (props) => {
  const AuthCode = lazy(() => import('./AuthCode'))

  return (
    <Suspense fallback="">
      <AuthCode {...props} />
    </Suspense>
  )
}

export default memo(AuthCodeAsync)
