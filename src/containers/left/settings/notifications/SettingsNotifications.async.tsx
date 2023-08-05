import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsNotificationsAsync: FC = (props) => {
  const SettingsNotifications = lazy(() => import('./SettingsNotifications'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsNotifications {...props} />
    </Suspense>
  )
}

export default memo(SettingsNotificationsAsync)
