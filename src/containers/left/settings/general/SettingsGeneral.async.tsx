import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsGeneralAsync: FC = (props) => {
  const SettingsGeneral = lazy(() => import('./SettingsGeneral'))

  return (
    <Suspense fallback={null}>
      <SettingsGeneral {...props} />
    </Suspense>
  )
}

export default memo(SettingsGeneralAsync)
