import {type FC, memo, useEffect, useRef} from 'preact/compat'

import {getActions} from 'state/action'
import 'state/actions/all'
import {type MapState, connect} from 'state/connect'
import {selectSelf} from 'state/selectors/users'
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
  newContactByPhone?: boolean
  shouldGetSelf: boolean
}
const Main: FC<StateProps> = ({
  isNewContactModalOpen,
  newContactByPhone,
  newContactUserId,
  shouldGetSelf,
}) => {
  const global = getGlobalState()
  const {getChats, getSelf, getContactList, updateUserStatus} = getActions()
  useEffect(() => {
    if (shouldGetSelf) {
      getSelf()
    }
    updateUserStatus({isOnline: true, isFirst: true})
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

  return (
    <div class="Main">
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />
      <NewContactModal isOpen={isNewContactModalOpen} userId={newContactUserId} />
      <Notification isOpen={global.notification.isOpen} />
      <CommonModal isOpen={global.commonModal.isOpen} />
    </div>
  )
}

// export default memo(Main)

const mapStateToProps: MapState<OwnProps, StateProps> = (state) => {
  const {isByPhoneNumber, userId} = state.newContact

  return {
    isNewContactModalOpen: Boolean(isByPhoneNumber || userId),
    newContactByPhone: isByPhoneNumber,
    newContactUserId: userId,
    shouldGetSelf: !selectSelf(state),
  }
}

export default memo(connect(mapStateToProps)(Main))
