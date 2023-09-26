import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const SettingsChatFolderEdit: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()

  /* is creating? create, else edit? */
  return (
    <>
      <ColumnWrapper title="Edit Folder" onGoBack={resetScreen}>
        <h1>Edit folder</h1>
      </ColumnWrapper>
    </>
  )
}

export default memo(SettingsChatFolderEdit)
