import {type FC, memo, useEffect} from 'preact/compat'

import 'state/actions/all'
import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {MiddleColumn} from 'containers/middle'
import LeftColumn from 'containers/left/LeftColumn'
import RightColumn from 'containers/right/RightColumn'

import Notification from 'components/popups/Notification.async'
import NewContactModal from 'components/popups/NewContactModal.async'

import {destroySubscribe, getSubscriptions} from 'state/subscribe'

import './Main.scss'

const Main: FC = () => {
  const global = getGlobalState()
  const {getContactList, getChats} = getActions()
  const subscriptions = getSubscriptions()
  useEffect(() => {
    getContactList()
    getChats()

    subscriptions.onChatCreated()

    return () => {
      destroySubscribe('onChatCreated')
    }
  }, [])
  return (
    <div class="Main">
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />
      <NewContactModal
        isOpen={Boolean(global.newContact.userId) || global.newContact.isByPhoneNumber}
        userId={global.newContact.userId}
      />
      <Notification isOpen={global.notification.isOpen} />
    </div>
  )
}

export default memo(Main)
