import {deepSignal, type DeepSignal} from 'deepsignal'
import type {Signal} from '@preact/signals'

import {updateByKey} from 'utilities/object/updateByKey'

import type {State} from 'types/state'
import type {AppStorageManager} from './appStorageManager'
import type {RootStorage} from 'lib/idb/keyval'
import {AuthScreens} from 'types/screens'

// type SettingsState = `settings.${keyof State['settings']}`
// type AuthState = `auth.${keyof State['auth']}`

// type StateKey = SettingsState | AuthState

const INIT_STATE: State = {
  auth: {
    currentUserId: undefined,
    rememberMe: true,
    screen: AuthScreens.PhoneNumber,
    phoneNumber: undefined,
    session: undefined
  },
  settings: {
    distanceUnit: 'kilometers',
    language: 'en',
    messageSendKey: 'enter',
    theme: 'dark',
    timeFormat: '24h',
    messageTextSize: 16,
    transitions: {
      menuBlur: true,
      pageTransitions: true
    },
    languages: undefined
  }
}
export class AppStateManager {
  public state!: DeepSignal<State> = deepSignal(INIT_STATE)
  private storage!: RootStorage<State>

  public constructor(private appStorageManager: AppStorageManager) {}
  /* IDK WHERE BUT NEED TO INITIALIZE STATE */
  public async init() {
    this.appStorageManager.loadStorage('state').then(({storage, result}) => {
      this.storage = storage

      if (result) {
        updateByKey(this.state.auth, result.auth)
        updateByKey(this.state.settings, result.settings)
      }
      // this.state = result?updateByKey(this.state)/* deepSignal(result || INIT_STATE) */
      console.log(this.state, 'INIT STATE')
    })
  }

  public setState<T extends keyof State>(
    key: T,
    value: Partial<State[T]>,
    persist?: boolean
  ) {
    // const [group, stateKey] = key.split('.')

    if (key === 'settings') {
      updateByKey(this.state.settings, value)
    } else if (key === 'auth') {
      updateByKey(this.state.auth, value)
    }

    if (persist) {
      const toStorageValue = {
        ...this.state[key],
        ...value
      }
      this.setToStorage(key, toStorageValue)
    }
  }

  /* idk, but i think, that i need to change state like state[key]=... */
  public subscribe<T extends keyof State>(key: T, handler: (updated: State[T]) => void) {
    ;(this.state[`${key}`] as unknown as Signal<State[T]>).subscribe(handler)

    /* this.state.$auth.subscribe(()=>{}) */
  }

  private setToStorage<T extends keyof State>(key: T, value: State[T] = this.state[key]) {
    return this.storage.set({
      [key]: value
    })
  }
}
