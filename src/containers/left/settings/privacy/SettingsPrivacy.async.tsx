import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsPrivacyAsync: FC = (props) => {
  const SettingsPrivacy = lazy(() => import('./SettingsPrivacy'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsPrivacy {...props} />
    </Suspense>
  )
}

export default memo(SettingsPrivacyAsync)
