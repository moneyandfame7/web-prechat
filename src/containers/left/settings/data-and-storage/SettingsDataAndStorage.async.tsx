import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsDataAndStorageAsync: FC = (props) => {
  const SettingsDataAndStorage = lazy(() => import('./SettingsDataAndStorage'))

  return (
    <Suspense fallback={null}>
      <SettingsDataAndStorage {...props} />
    </Suspense>
  )
}

export default memo(SettingsDataAndStorageAsync)
