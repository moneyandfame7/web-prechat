import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

import type {SettingsProps} from './Settings'

const SettingsAsync: FC<SettingsProps> = (props) => {
  const Settings = lazy(() => import('./Settings'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <Settings {...props} />
    </Suspense>
  )
}

export default memo(SettingsAsync)
