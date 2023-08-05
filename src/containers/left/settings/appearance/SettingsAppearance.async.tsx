import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsAppearanceAsync: FC = (props) => {
  const SettingsAppearance = lazy(() => import('./SettingsAppearance'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsAppearance {...props} />
    </Suspense>
  )
}

export default memo(SettingsAppearanceAsync)
