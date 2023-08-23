import type {AuthConnection} from 'api/types'
import type {State} from 'types/state'

import type {AppStateManager} from './appStateManager'
import {makeRequest} from 'utilities/makeRequest'
import {USER_BROWSER, USER_PLATFORM} from 'common/config'

export class RootManager {
  public myId?: string
  public settings?: State['settings']
  public connection?: AuthConnection
  public constructor(private appStateManager: AppStateManager) {}

  public async init() {
    this.settings = this.appStateManager.state.settings
    this.myId = this.appStateManager.state.auth.currentUserId
    await this.fetchConnection()

    console.log('$$$$ROOOOT$$$$', this)
  }

  public async fetchConnection(): Promise<void> {
    // const userConnection = await makeRequest('connection')

    // this.connection = {
    //   ...userConnection,
    //   browser: USER_BROWSER,
    //   platform: USER_PLATFORM
    // }
    console.log('WAS SETTED CONNECTION')
  }
}
