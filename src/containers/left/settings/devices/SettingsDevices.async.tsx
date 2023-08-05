import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsDevicesAsync: FC = (props) => {
  const SettingsDevices = lazy(() => import('./SettingsDevices'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsDevices {...props} />
    </Suspense>
  )
}

export default memo(SettingsDevicesAsync)
