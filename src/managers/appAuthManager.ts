import {deepSignal} from 'deepsignal'
import type {ConfirmationResult, RecaptchaVerifier} from 'firebase/auth'

import {Api} from 'api/manager'
import * as firebase from 'lib/firebase'

// import type {AppManager} from './manager'
import {updateByKey} from 'utilities/object/updateByKey'
import type {AuthStage} from 'types/state'
import type {AuthSignInResponse} from 'api/types'
import {unformatStr} from 'utilities/string/stringRemoveSpacing'
import type {AppStateManager} from './appStateManager'
import type {RootManager} from './root'
import {timeout} from 'utilities/schedulers/timeout'
import {AuthScreens} from 'types/screens'

export type TempAuthState = {
  error?: string
  isLoading: boolean
  firebase_token?: string
  captcha?: RecaptchaVerifier
  confirmResult?: ConfirmationResult
  userId?: string
  screen: AuthScreens
  phoneNumber?: string
  rememberMe: boolean
}
export class AppAuthManager {
  public tempState = deepSignal<TempAuthState>({
    screen: AuthScreens.PhoneNumber,
    rememberMe: true,
    isLoading: false
  })

  public constructor(
    private $root: RootManager,
    private appStateManager: AppStateManager
  ) {}

  public async init() {
    this.setTempByKeys({
      isLoading: true
    })
    if (!this.$root.connection) {
      await this.$root.fetchConnection()
    }
    firebase.generateRecaptcha(this.tempState)

    this.setTempByKeys({
      isLoading: false
    })
  }

  public async sendPhone(phone: string) {
    this.setTempByKeys({isLoading: true})

    const result = await Api.auth.sendPhone(unformatStr(phone))
    if (!result) {
      return
    }

    if (result.hasActiveSession) {
      /* send code from app */
    }

    const {
      settings: {language}
    } = this.appStateManager.state

    // await timeout(500)(true).then((mockSucessful) => {
    //   console.log({mockSucessful})
    // })
    const successfully = await firebase.sendCode(this.tempState, language, phone)
    console.log({successfully})
    // if (!successfully) {
    //   return
    // }

    this.setTempByKeys({
      isLoading: false,
      screen: AuthScreens.Code,
      userId: result.userId,
      phoneNumber: phone
    })
  }

  public async verifyCode(code: string) {
    this.setTempByKeys({isLoading: true})

    const {
      settings: {language}
    } = this.appStateManager.state

    const firebase_token = await firebase.verifyCode(this.tempState, language, code)
    // if (!firebase_token) {
    //   return
    // }

    console.log(`NEED TO VERIFY: [ ${code} ]`)

    // if (this.tempState.userId && this.tempState.phoneNumber) {
    //   /*  */
    //   this.signIn()
    // }
  }

  public async signIn() {
    if (!this.tempState.phoneNumber || !this.tempState.firebase_token) {
      return
    }

    this.setTempByKeys({isLoading: true})

    let result: AuthSignInResponse | undefined
    try {
      result = await Api.auth.signIn({
        phoneNumber: unformatStr(this.tempState.phoneNumber!),
        firebase_token: this.tempState.firebase_token,
        connection: this.$root.connection!
      })
    } catch (e) {
      console.warn(e, 'SIGN_IN_ERROR')
    }

    if (!result) {
      return
    }

    this.appStateManager.setState(
      'auth',
      {
        currentUserId: this.tempState.userId,
        phoneNumber: this.tempState.phoneNumber,
        rememberMe: this.tempState.rememberMe,
        session: result.sessionHash
      },
      this.tempState.rememberMe
    )
  }

  // private setTemp<T extends keyof TempState>(key: T, value: TempState[T]) {
  //   this.tempState[key] = value
  // }

  public setTempByKeys(value: Partial<TempAuthState>) {
    updateByKey(this.tempState, value)
  }

  public mockAuth() {
    this.appStateManager.setState('auth', {
      session: '18284812834812834812384',
      currentUserId: 'DOLBAEB A NE ID',
      phoneNumber: '123456789',
      rememberMe: true
    })
  }
}
