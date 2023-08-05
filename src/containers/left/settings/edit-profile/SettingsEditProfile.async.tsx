import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsEditProfileAsync: FC = (props) => {
  const SettingsEditProfile = lazy(() => import('./SettingsEditProfile'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsEditProfile {...props} />
    </Suspense>
  )
}

export default memo(SettingsEditProfileAsync)
