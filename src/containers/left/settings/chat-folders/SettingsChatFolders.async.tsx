import {type FC, Suspense, lazy, memo} from 'preact/compat'

const SettingsChatFoldersAsync: FC = (props) => {
  const SettingsChatFolders = lazy(() => import('./SettingsChatFolders'))

  return (
    <Suspense fallback={null}>
      <SettingsChatFolders {...props} />
    </Suspense>
  )
}

export default memo(SettingsChatFoldersAsync)
