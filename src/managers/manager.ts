import {DATABASE_OPTIONS, Database} from 'lib/idb/database'

import {AppAuthManager} from './appAuthManager'
import {AppStateManager} from './appStateManager'
import {AppUsersManager} from './appUsersManager'
import {AppStorageManager} from './appStorageManager'
import {RootManager} from './root'

export async function createManagers() {
  const database = new Database()
  await database.init(DATABASE_OPTIONS)

  const appStorageManager = new AppStorageManager(database)

  const appStateManager = new AppStateManager(appStorageManager)
  await appStateManager.init()

  const $root = new RootManager(appStateManager)
  await $root.init()

  const appAuthManager = new AppAuthManager($root, appStateManager)
  const appUsersManager = new AppUsersManager(appStateManager, appStorageManager)

  await appUsersManager.init()

  return {
    appStateManager,
    appAuthManager,
    appUsersManager,
    $root
  }
}
export type AppManagers = Awaited<ReturnType<typeof createManagers>>
/**
 * I take names for classes from
 * https://github.com/morethanwords/tweb/blob/master/src/lib/appManagers/manager.ts
 *  :)
 *
 */

export class AppManager {
  public appUsersManager: AppUsersManager
  public appAuthManager: AppAuthManager
  public appStateManager: AppStateManager
  public $root: RootManager

  public setManagers(managers: AppManagers) {
    console.log('WAS SET MANAGERS:', managers)
    Object.assign(this, managers)
  }
}

export const appManager = new AppManager()
