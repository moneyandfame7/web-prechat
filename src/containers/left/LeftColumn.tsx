import { type FC, memo } from 'preact/compat'
import { type VNode } from 'preact'

import { MountTransition } from 'components/MountTransition'
import type { TransitionType } from 'components/Transition'

import { LeftColumnScreen } from 'types/ui'
import { getGlobalState } from 'state/signal'
import { updateGlobalState } from 'state/persist'
import { useResize, useScreenManager } from 'hooks'

import LeftMain from './main/LeftMain'
import CreateChat from './create/CreateChat.async'
import Settings from './settings/Settings.async'
import Contacts from './contacts/Contacts.async'

import { LeftColumnProvider } from './context'

import './LeftColumn.scss'

const classNames = {
  [LeftColumnScreen.Main]: 'LeftColumn-Main',
  [LeftColumnScreen.Contacts]: 'LeftColumn-Contacts',
  [LeftColumnScreen.Settings]: 'LeftColumn-Settings',
  [LeftColumnScreen.Create]: 'LeftColumn-Create'
}
const screenCases: Record<LeftColumnScreen, VNode> = {
  [LeftColumnScreen.Main]: <LeftMain />,
  [LeftColumnScreen.Contacts]: <Contacts />,
  [LeftColumnScreen.Create]: <CreateChat />,
  [LeftColumnScreen.Settings]: <Settings />
}
interface VNodeWithKey<T> extends VNode {
  key: T
}
function getScreenTransition(
  // newEl: VNodeWithKey<LeftColumnScreen>,
  current: VNodeWithKey<LeftColumnScreen>
): TransitionType {
  if (current.key === LeftColumnScreen.Main) {
    return 'zoomSlideReverse'
  }

  return 'zoomSlide'
}
const LeftColumn: FC = () => {
  const leftColumnWidth = getGlobalState(
    (state) => state.settings.leftColumnWidth
  )
  const { ref, resize, width } = useResize<HTMLDivElement>({
    initialWidth: leftColumnWidth,
    minWidth: 250,
    maxWidth: 430,
    debounceCb: (width) => {
      updateGlobalState({
        settings: {
          leftColumnWidth: width
        }
      })
    }
  })

  const { setScreen, renderScreen, resetScreen, activeScreen } =
    useScreenManager<LeftColumnScreen>({
      initial: LeftColumnScreen.Main,
      cases: screenCases
    })
  return (
    <LeftColumnProvider
      store={{
        resetScreen,
        setScreen,
        activeScreen
      }}
    >
      <div
        class="LeftColumn"
        ref={ref}
        style={{ width, '--left-column-width': width + 'px' }}
      >
        <MountTransition
          classNames={classNames}
          shouldCleanup={[LeftColumnScreen.Settings, LeftColumnScreen.Contacts]}
          activeKey={activeScreen}
          initial={false}
          name="zoomFade"
          getTransitionForNew={getScreenTransition}
        >
          {renderScreen()}
        </MountTransition>
        <div class="LeftColumn-resizer" onMouseDown={resize} />
      </div>
    </LeftColumnProvider>
  )
}

export default memo(LeftColumn)
