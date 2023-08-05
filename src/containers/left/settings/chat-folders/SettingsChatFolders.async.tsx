import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'

const SettingsChatFoldersAsync: FC = (props) => {
  const SettingsChatFolders = lazy(() => import('./SettingsChatFolders'))

  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettingsChatFolders {...props} />
    </Suspense>
  )
}

export default memo(SettingsChatFoldersAsync)
