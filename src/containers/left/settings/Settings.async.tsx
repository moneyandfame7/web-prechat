import { type FC, Suspense, lazy, memo } from 'preact/compat'

const SettingsAsync: FC = (props) => {
  const Settings = lazy(() => import('./Settings'))

  return (
    <Suspense fallback="">
      <Settings {...props} />
    </Suspense>
  )
}

export default memo(SettingsAsync)
