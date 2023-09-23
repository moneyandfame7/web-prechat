import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsLanguageAsync: FC = (props) => {
  const SettingsLanguage = lazy(() => import('./SettingsLanguage'))

  return (
    <Suspense fallback={null}>
      <SettingsLanguage {...props} />
    </Suspense>
  )
}

export default memo(SettingsLanguageAsync)
