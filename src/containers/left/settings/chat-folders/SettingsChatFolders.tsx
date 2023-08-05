import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {IconButton} from 'components/ui'

const ChatFolders: FC = () => {
  const {resetScreen} = SettingsContext.useScreenContext()

  return (
    <>
      <div class="LeftColumn-Header">
        <IconButton icon="arrowLeft" onClick={resetScreen} />
        <p class="LeftColumn-Header_title">Chat folders</p>
      </div>
      <h1>ChatFolders</h1>
    </>
  )
}

export default memo(ChatFolders)
