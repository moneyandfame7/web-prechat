import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsPrivacyAsync: FC = (props) => {
  const SettingsPrivacy = lazy(() => import('./SettingsPrivacy'))

  return (
    <Suspense fallback={null}>
      <SettingsPrivacy {...props} />
    </Suspense>
  )
}

export default memo(SettingsPrivacyAsync)
