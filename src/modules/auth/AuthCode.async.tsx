import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const AuthCodeAsync: FC = (props) => {
  const AuthCode = lazy(() => import('./AuthCode').then((module) => module.default))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <AuthCode {...props} />
    </Suspense>
  )
}

export default memo(AuthCodeAsync)
