import type {SettingsState} from 'types/state'

// interface IBroadcastChannel{
//   addEventListener:()
// }
const channel = new BroadcastChannel('syncState')

function handleMessage(ev: MessageEvent) {
  console.log('NEW MESSAGE: ', ev.data)
  // console.log()
}
export function subscribeToSyncUpdate() {
  channel.addEventListener('message', handleMessage)
}
export function unsubscribeFromSyncUpdate() {
  channel.removeEventListener('message', handleMessage)
}

export function updateSyncState(state: Partial<SettingsState>) {
  channel.postMessage(state)
}
