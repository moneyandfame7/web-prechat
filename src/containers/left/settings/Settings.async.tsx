import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {timeout} from 'utilities/timeout'
import {ScreenLoader} from 'components/ScreenLoader'

const SettingsAsync: FC = (props) => {
  const Settings = lazy(() =>
    import('./Settings').then((module) => module.default).then(timeout(0))
  )
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Settings {...props} />
    </Suspense>
  )
}

export default memo(SettingsAsync)
