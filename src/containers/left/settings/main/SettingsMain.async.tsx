import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsMainAsync: FC = (props) => {
  const SettingsMain = lazy(() => import('./SettingsMain'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsMain {...props} />
    </Suspense>
  )
}

export default memo(SettingsMainAsync)
