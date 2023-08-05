import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsDataAndStorageAsync: FC = (props) => {
  const SettingsDataAndStorage = lazy(() => import('./SettingsDataAndStorage'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsDataAndStorage {...props} />
    </Suspense>
  )
}

export default memo(SettingsDataAndStorageAsync)
