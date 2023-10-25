import {type FC, memo, useEffect, useRef} from 'preact/compat'

import {getActions} from 'state/action'
import 'state/actions/all'
import {type MapState, connect} from 'state/connect'
import {getGlobalState} from 'state/signal'
import {destroySubscribeAll, subscribeToAll} from 'state/subscribe'

import {useEventListener} from 'hooks/useEventListener'

import LeftColumn from 'containers/left/LeftColumn'
import MiddleColumn from 'containers/middle/MiddleColumn'
import {RightColumn} from 'containers/right/RightColumn'

import CommonModal from 'components/popups/CommonModal.async'
import NewContactModal from 'components/popups/NewContactModal.async'
import Notification from 'components/popups/Notification.async'

import './Main.scss'

interface OwnProps {}
interface StateProps {
  isNewContactModalOpen: boolean
  newContactUserId?: string
  isNewContactByPhone?: boolean
}
const Main: FC<StateProps> = ({isNewContactModalOpen, newContactUserId}) => {
  const global = getGlobalState()
  const {getChats, getSelf, getContactList, updateUserStatus} = getActions()
  useEffect(() => {
    getSelf()

    // if (shouldGetSelf) {
    // }
    updateUserStatus({isOnline: true, isFirst: true, noDebounce: true})

    getChats()
    getContactList()

    subscribeToAll()
    return () => {
      destroySubscribeAll()
    }
  }, [])
  const documentRef = useRef<Document>(document)

  useEventListener(
    'visibilitychange',
    () => {
      updateUserStatus({isOnline: !document.hidden})
    },
    documentRef
  )
  // const {value, toggle} = useBoolean()
  const render = useRef(0)
  render.current += 1
  return (
    <div class="Main">
      <LeftColumn />
      <MiddleColumn />

      {/* <div>
        RIGHT COLUMN?
        {render.current}
          <ProfileAvatar
          peer={selectChat(global, global.openedChats[global.openedChats.length - 1].chatId!)!}
        />
         <Photo />
      </div> */}
      <RightColumn />
      <NewContactModal isOpen={isNewContactModalOpen} userId={newContactUserId} />
      <Notification isOpen={global.notification.isOpen} />
      <CommonModal isOpen={global.commonModal.isOpen} />
    </div>
  )
}

// export default memo(Main)

const mapStateToProps: MapState<OwnProps, StateProps> = (state) => {
  const {isByPhoneNumber, userId, isOpen} = state.newContact

  return {
    isNewContactModalOpen: isOpen,
    isNewContactByPhone: isByPhoneNumber,
    newContactUserId: userId,
  }
}

export default memo(connect(mapStateToProps)(Main))
