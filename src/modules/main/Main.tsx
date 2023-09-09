import {type FC, memo, useEffect, useRef} from 'preact/compat'

import {getActions} from 'state/action'
import 'state/actions/all'
import {selectSelf} from 'state/selectors/users'
import {getGlobalState} from 'state/signal'
import {
  Subscribes,
  destroySubscribe,
  destroySubscribeAll,
  getSubscriptions,
  subscribeToAll,
} from 'state/subscribe'

import {useEventListener} from 'hooks/useEventListener'

import LeftColumn from 'containers/left/LeftColumn'
import {MiddleColumn} from 'containers/middle'
import RightColumn from 'containers/right/RightColumn'

import CommonModal from 'components/popups/CommonModal.async'
import NewContactModal from 'components/popups/NewContactModal.async'
import Notification from 'components/popups/Notification.async'

import './Main.scss'

const Main: FC = () => {
  const global = getGlobalState()
  const {getChats, getSelf, getContactList, updateUserStatus} = getActions()
  // const subscriptions = getSubscriptions()
  useEffect(() => {
    if (!selectSelf(global)) {
      getSelf()
    }
    updateUserStatus({isOnline: true, isFirst: true})
    getChats()
    getContactList()
    // add to persist state that auth was updated less than 1 hour ago ?? or 20minutes, or 10 minutes ......

    // subscriptions.onChatCreated()
    // subscriptions.onAuthorizationCreated()
    // subscriptions.onAuthorizationTerminated()
    // subscriptions.onAuthorizationUpdated()
    // subscriptions.onUserStatusUpdated()
    // for (const cb in subscriptions) {
    //   if (cb in subscriptions) {
    //     subscriptions[cb as keyof Subscribes]()
    //   }
    // }
    subscribeToAll()
    return () => {
      destroySubscribeAll()

      // destroySubscribe('onChatCreated')
      // destroySubscribe('onAuthorizationCreated')
      // destroySubscribe('onAuthorizationTerminated')
      // destroySubscribe('onAuthorizationUpdated')
      // destroySubscribe('onUserStatusUpdated')
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
  const isNewContactModalOpen = Boolean(
    global.newContact.userId || global.newContact.isByPhoneNumber
  )

  return (
    <div class="Main">
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />
      <NewContactModal isOpen={isNewContactModalOpen} userId={global.newContact.userId} />
      <Notification isOpen={global.notification.isOpen} />
      <CommonModal isOpen={global.commonModal.isOpen} />
    </div>
  )
}

export default memo(Main)
