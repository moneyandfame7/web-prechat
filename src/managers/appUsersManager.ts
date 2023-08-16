import type {DeepSignal} from 'deepsignal'

import {Api} from 'api/manager'
import type {ApiUser} from 'api/types'

import {updateByKey} from 'utilities/object/updateByKey'
import type {RootStorage} from 'lib/idb/keyval'

import type {AppStateManager} from './appStateManager'
import type {AppStorageManager} from './appStorageManager'

export class AppUsersManager {
  /* DeepSignal? */
  private storage!: RootStorage<Record<string, ApiUser>>
  private users!: DeepSignal<{[userId: string]: ApiUser}>
  private contactsList: Set<string> = new Set()
  private myId?: string
  public constructor(
    private appStateManager: AppStateManager,
    private appStorageManager: AppStorageManager
  ) {
    /*  */
  }
  public async init() {
    this.appStorageManager.loadStorage('users').then(({storage, result}) => {
      this.storage = storage

      this.myId = this.appStateManager.state.auth.currentUserId
      if (result) {
        updateByKey(this.users, result)
      }
    })

    for (const userId in this.users) {
      if (this.users[userId].isContact) {
        this.contactsList.add(userId)
      }
    }

    if (!this.getSelf() && this.myId) {
      this.fetchUser(this.myId)
    }
  }

  public getUser(userId: string) {
    return this.users[userId]
  }

  public getSelf() {
    return this.myId ? this.users[this.myId] : undefined
  }

  private async fetchUser(userId: string) {
    const result = await Api.users.getUsers({ids: [userId]})
    if (!result) {
      return
    }
    const fetched = result[0]

    this.users[userId] = fetched
  }
}
