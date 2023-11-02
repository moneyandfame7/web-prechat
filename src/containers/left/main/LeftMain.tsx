import {type FC, Fragment, memo} from 'preact/compat'
import {useCallback, useEffect, useState} from 'preact/hooks'

import {LeftColumnScreen} from 'types/screens'

import {StoriesList} from 'containers/stories/list'

import {ColumnHeader} from 'components/ColumnHeader'
import {Transition} from 'components/transitions'
import {SearchInput} from 'components/ui'

import {LeftGoBack} from '../LeftGoBack'
import {useLeftColumn} from '../context'
import {CreateChatButton} from './CreateChatButton'
import {LeftMainMenu} from './MainMenu'
import {ChatFolders} from './chats/ChatFolders'
import {ChatList} from './chats/ChatList'
import Search from './search/Search.async'

import './LeftMain.scss'

enum LeftMainGroup {
  Chats,
  Search,
}

const LeftMain: FC = (props) => {
  const [search, setSearch] = useState('')

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
        return <ChatFolders />
      case LeftMainGroup.Search:
        return <Search />
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

  const isSearchInputFocused = activeGroup === LeftMainGroup.Search

  return (
    <Fragment {...props}>
      <ColumnHeader className="LeftColumn-Header">
        <Transition
          name="rotate"
          activeKey={activeGroup}
          shouldCleanup={false}
          containerClassname="left-column-header__btn-container"
        >
          {renderButton()}
        </Transition>
        {/* <InputText onFocus={handleFocusInput} elRef={inputRef} value={search} onInput={()=>)}/> */}
        <SearchInput
          isFocused={isSearchInputFocused}
          value={search}
          onInput={handleSearch}
          onFocus={handleFocusInput}
        />
        {/* <InputText
          value={search}
          onInput={(v) => {
            console.log(v)
          }}
          onFocus={handleFocusInput}
        /> */}
      </ColumnHeader>
      {/* <StoriesList /> */}

      <div class="LeftColumn-Main_inner scrollable">
        {/* <SwitchTransition
          classNames={classNames}
          name="fade"
          activeKey={activeGroup}
          durations={350}
          // shouldCleanup={[LeftMainGroup.Search]}
          cleanupException={[LeftMainGroup.Chats]}
          initial={false}
        >
          {renderScreen()}
        </SwitchTransition> */}
        <Transition
          activeKey={activeGroup}
          name="zoomFade"
          cleanupException={LeftMainGroup.Chats}
        >
          {renderScreen()}
        </Transition>
        <CreateChatButton />
      </div>
    </Fragment>
  )
}

export default memo(LeftMain)
