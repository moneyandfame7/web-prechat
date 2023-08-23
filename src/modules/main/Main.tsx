import {type FC, memo, useEffect} from 'preact/compat'

import {MiddleColumn} from 'containers/middle'
import LeftColumn from 'containers/left/LeftColumn'
import RightColumn from 'containers/right/RightColumn'

import Notification from 'components/popups/Notification.async'
import NewContactModal from 'components/popups/NewContactModal.async'

import {destroySubscribe, getSubscriptions} from 'state/subscribe'

import {combinedStore} from 'store/combined'
import './Main.scss'

const Main: FC = () => {
  const appActions = combinedStore.getActions()
  const appState = combinedStore.getState()
  const subscriptions = getSubscriptions()
  useEffect(() => {
    appActions.users.getContactsList()
    appActions.chats.getChats()
    // subscriptions.onChatCreated()

    // return () => {
    //   destroySubscribe('onChatCreated')
    // }
  }, [])
  return (
    <div class="Main">
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />
      <NewContactModal
        isOpen={
          Boolean(appState.users.newContact.userId) ||
          appState.users.newContact.isByPhoneNumber
        }
        userId={appState.users.newContact.userId}
      />
      <Notification isOpen={appState.ui.notification.isOpen} />
    </div>
  )
}

export default memo(Main)
