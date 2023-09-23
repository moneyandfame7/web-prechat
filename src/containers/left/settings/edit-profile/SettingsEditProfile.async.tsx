import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsEditProfileAsync: FC = (props) => {
  const SettingsEditProfile = lazy(() => import('./SettingsEditProfile'))

  return (
    <Suspense fallback={null}>
      <SettingsEditProfile {...props} />
    </Suspense>
  )
}

export default memo(SettingsEditProfileAsync)
