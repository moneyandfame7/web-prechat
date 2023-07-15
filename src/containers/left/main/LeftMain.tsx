import {type FC, memo} from 'preact/compat'
import {useCallback, useState, useRef} from 'preact/hooks'

import {SearchInput} from 'components/ui'
import {MountTransition} from 'components/MountTransition'

import {LeftColumnMainScreen} from 'types/ui'

import {Chats} from './chats/Chats'
import {Search} from './search/Search'

import {LeftGoBack} from '../LeftGoBack'
import {LeftMainMenu} from './MainMenu'
import {CreateChatButton} from './CreateChatButton'
import {LeftColumnMainProvider} from './context'

import './LeftMain.scss'

const classNames = {
  [LeftColumnMainScreen.Chats]: 'LeftColumn-Main_Chats scrollable',
  [LeftColumnMainScreen.Search]: 'LeftColumn-Main_Search'
}

const LeftMain: FC = () => {
  const [activeScreen, setActiveScreen] = useState(LeftColumnMainScreen.Chats)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const renderScreen = useCallback(() => {
    switch (activeScreen) {
      case LeftColumnMainScreen.Chats:
        return <Chats key={LeftColumnMainScreen.Chats} />
      case LeftColumnMainScreen.Search:
        return <Search key={LeftColumnMainScreen.Search} />
    }
  }, [activeScreen])

  const resetScreen = useCallback(() => {
    setActiveScreen(LeftColumnMainScreen.Chats)
    inputRef.current?.blur()
  }, [])

  const setScreen = useCallback((screen: LeftColumnMainScreen) => {
    setActiveScreen(screen)
  }, [])

  const handleFocusInput = useCallback(() => {
    setScreen(LeftColumnMainScreen.Search)
  }, [])

  const renderMainButton = () => {
    switch (activeScreen) {
      case LeftColumnMainScreen.Chats:
        return <LeftMainMenu />

      case LeftColumnMainScreen.Search:
        return <LeftGoBack />
    }
  }
  return (
    <LeftColumnMainProvider
      store={{
        activeScreen,
        resetScreen,
        setScreen
      }}
    >
      <div class="LeftColumn-Header">
        {renderMainButton()}
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
    </LeftColumnMainProvider>
  )
}

export default memo(LeftMain)
