import {type FC, memo, Fragment} from 'preact/compat'
import {useCallback, useState, useRef} from 'preact/hooks'

import {SearchInput} from 'components/ui'
import {SwitchTransition} from 'components/transitions'

import {LeftColumnScreen} from 'types/ui'

import {Chats} from './chats/Chats'
import Search from './search/Search.async'

import {LeftGoBack} from '../LeftGoBack'
import {LeftMainMenu} from './MainMenu'
import {CreateChatButton} from './CreateChatButton'

import {useLeftColumn} from '../context'

import './LeftMain.scss'

enum LeftMainGroup {
  Chats = 'Chats',
  Search = 'Search'
}
const classNames: Record<LeftMainGroup, string> = {
  [LeftMainGroup.Chats]: 'LeftColumn-Chats scrollable',
  [LeftMainGroup.Search]: 'LeftColumn-Search'
}

const LeftMain: FC = (props) => {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const {activeScreen, setScreen} = useLeftColumn()
  let activeGroup: LeftMainGroup = LeftMainGroup.Chats
  switch (activeScreen) {
    case LeftColumnScreen.Chats:
      activeGroup = LeftMainGroup.Chats
      break
    case LeftColumnScreen.Search:
      activeGroup = LeftMainGroup.Search
  }
  const renderScreen = useCallback((activeScreen: LeftMainGroup) => {
    switch (activeScreen) {
      case LeftMainGroup.Chats:
        return <Chats key={LeftMainGroup.Chats} />
      case LeftMainGroup.Search:
        return <Search key={LeftMainGroup.Search} />
    }
  }, [])
  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])
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
          initial={false}
        >
          {renderScreen(activeGroup)}
        </SwitchTransition>
        <CreateChatButton />
      </div>
    </Fragment>
  )
}

export default memo(LeftMain)
