import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsDevicesAsync: FC = (props) => {
  const SettingsDevices = lazy(() => import('./SettingsDevices'))

  return (
    <Suspense fallback={null}>
      <SettingsDevices {...props} />
    </Suspense>
  )
}

export default memo(SettingsDevicesAsync)
