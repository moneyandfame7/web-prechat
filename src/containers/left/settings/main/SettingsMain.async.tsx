import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsMainAsync: FC = (props) => {
  const SettingsMain = lazy(() => import('./SettingsMain'))

  return (
    <Suspense fallback={null}>
      <SettingsMain {...props} />
    </Suspense>
  )
}

export default memo(SettingsMainAsync)
