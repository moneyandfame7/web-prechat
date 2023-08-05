import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsGeneralAsync: FC = (props) => {
  const SettingsGeneral = lazy(() => import('./SettingsGeneral'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsGeneral {...props} />
    </Suspense>
  )
}

export default memo(SettingsGeneralAsync)
