import {type FC, memo, Fragment} from 'preact/compat'
import {useCallback, useState, useRef} from 'preact/hooks'

import {SearchInput} from 'components/ui'
import MountTransition from 'components/MountTransition'

import {LeftColumnMainScreen, LeftColumnScreen} from 'types/ui'

import {Chats} from './chats/Chats'
import Search from './search/Search.async'

import {LeftGoBack} from '../LeftGoBack'
import {LeftMainMenu} from './MainMenu'
import {CreateChatButton} from './CreateChatButton'

import {useLeftColumn} from '../context'

import './LeftMain.scss'

const classNames = {
  [LeftColumnMainScreen.Chats]: 'LeftColumn-Chats scrollable',
  [LeftColumnMainScreen.Search]: 'LeftColumn-Search'
}

const LeftMain: FC = (props) => {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const {activeScreen, setScreen} = useLeftColumn()
  const renderScreen = useCallback(() => {
    switch (activeScreen) {
      case LeftColumnScreen.Chats:
        return <Chats key={LeftColumnScreen.Chats} />
      case LeftColumnScreen.Search:
        return <Search key={LeftColumnScreen.Search} />
      default:
        return <Chats key={LeftColumnScreen.Chats} />
    }
  }, [activeScreen])
  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleFocusInput = useCallback(() => {
    setScreen(LeftColumnScreen.Search)
  }, [])
  const renderButton = useCallback(() => {
    switch (activeScreen) {
      case LeftColumnScreen.Search:
        return <LeftGoBack />
      default:
        return <LeftMainMenu />
    }
  }, [activeScreen])
  return (
    <Fragment {...props}>
      {/* <div class="LeftColumn-Header">
        {renderMainButton()}
 
      </div> */}
      <div class="LeftColumn-Header">
        {renderButton()}
        <SearchInput
          elRef={inputRef}
          value={search}
          onInput={handleSearch}
          onFocus={handleFocusInput}
        />
      </div>
      <div class="LeftColumn-Main_inner">
        <MountTransition
          classNames={classNames}
          name="zoomFade"
          activeKey={activeScreen}
          shouldCleanup={[LeftColumnMainScreen.Search]}
          initial={false}
        >
          {renderScreen()}
        </MountTransition>
        <CreateChatButton />
      </div>
    </Fragment>
  )
}

export default memo(LeftMain)
