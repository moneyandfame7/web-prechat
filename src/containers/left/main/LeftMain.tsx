import {type FC, Fragment, memo} from 'preact/compat'
import {useCallback, useEffect, useRef, useState} from 'preact/hooks'

import {LeftColumnScreen} from 'types/ui'

import {SwitchTransition} from 'components/transitions'
import {SearchInput} from 'components/ui'

import {LeftGoBack} from '../LeftGoBack'
import {useLeftColumn} from '../context'
import {CreateChatButton} from './CreateChatButton'
import {LeftMainMenu} from './MainMenu'
import {Chats} from './chats/ChatList'
import Search from './search/Search.async'

import './LeftMain.scss'

enum LeftMainGroup {
  Chats = 'Chats',
  Search = 'Search',
}
const classNames: Record<LeftMainGroup, string> = {
  [LeftMainGroup.Chats]: 'LeftColumn-Chats scrollable',
  [LeftMainGroup.Search]: 'LeftColumn-Search',
}

const LeftMain: FC = (props) => {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const {activeScreen, setScreen} = useLeftColumn()
  const [activeGroup, setActiveGroup] = useState(LeftMainGroup.Chats)

  useEffect(() => {
    switch (activeScreen) {
      case LeftColumnScreen.Chats:
        setActiveGroup(LeftMainGroup.Chats)
        break
      case LeftColumnScreen.Search:
        setActiveGroup(LeftMainGroup.Search)
        break
    }
  }, [activeScreen])

  const renderScreen = useCallback(() => {
    switch (activeGroup) {
      case LeftMainGroup.Chats:
        return <Chats key={LeftMainGroup.Chats} />
      case LeftMainGroup.Search:
        return <Search key={LeftMainGroup.Search} />
    }
  }, [activeGroup])
  const handleSearch = (value: string) => {
    // e.preventDefault()
    setSearch(value)
  }
  const handleFocusInput = useCallback(() => {
    setScreen(LeftColumnScreen.Search)
  }, [])
  const renderButton = useCallback(() => {
    switch (activeGroup) {
      case LeftMainGroup.Search:
        return <LeftGoBack />
      default:
        return <LeftMainMenu />
    }
  }, [activeGroup])

  return (
    <Fragment {...props}>
      <div class="LeftColumn-Header">
        {renderButton()}
        {/* <InputText onFocus={handleFocusInput} elRef={inputRef} value={search} onInput={()=>)}/> */}
        <SearchInput
          elRef={inputRef}
          value={search}
          onInput={handleSearch}
          onFocus={handleFocusInput}
        />
      </div>
      <div class="LeftColumn-Main_inner">
        <SwitchTransition
          classNames={classNames}
          name="fade"
          activeKey={activeGroup}
          durations={350}
          // shouldCleanup={[LeftMainGroup.Search]}
          cleanupException={[LeftMainGroup.Chats]}
          initial={false}
        >
          {renderScreen()}
        </SwitchTransition>
        <CreateChatButton />
      </div>
    </Fragment>
  )
}

export default memo(LeftMain)
