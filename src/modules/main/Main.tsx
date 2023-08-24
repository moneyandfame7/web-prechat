import {type FC, memo, useEffect} from 'preact/compat'

import 'state/actions/all'
import {destroySubscribe, getSubscriptions} from 'state/subscribe'
import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {MiddleColumn} from 'containers/middle'
import LeftColumn from 'containers/left/LeftColumn'
import RightColumn from 'containers/right/RightColumn'

import Notification from 'components/popups/Notification.async'
import NewContactModal from 'components/popups/NewContactModal.async'

import './Main.scss'

const Main: FC = () => {
  const global = getGlobalState()
  const {getChats, getContactList} = getActions()
  const subscriptions = getSubscriptions()
  useEffect(() => {
    getChats()
    getContactList()
    subscriptions.onChatCreated()

    return () => {
      destroySubscribe('onChatCreated')
    }
  }, [])

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
    </div>
  )
}

export default memo(Main)
