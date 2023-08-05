import type {GlobalState, SignalGlobalState} from 'types/state'
import {updateByKey} from 'utilities/object/updateByKey'

export function updateNotificationState(
  global: SignalGlobalState,
  notification: GlobalState['notification']
) {
  updateByKey(global.notification, notification)
}
