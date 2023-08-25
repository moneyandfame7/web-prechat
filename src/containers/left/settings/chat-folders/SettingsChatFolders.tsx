import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {ColumnWrapper} from 'components/ColumnWrapper'

const ChatFolders: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title="Language" onGoBack={resetScreen}>
      <h1>Chat folders</h1>
    </ColumnWrapper>
  )
}

export default memo(ChatFolders)
