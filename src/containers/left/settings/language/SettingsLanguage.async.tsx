import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsLanguageAsync: FC = (props) => {
  const SettingsLanguage = lazy(() => import('./SettingsLanguage'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsLanguage {...props} />
    </Suspense>
  )
}

export default memo(SettingsLanguageAsync)
