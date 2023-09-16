import type {DocumentNode} from '@apollo/client'

import {
  SUBSCRIBE_ON_AUTHORIZATION_CREATED,
  SUBSCRIBE_ON_AUTHORIZATION_TERMINATED,
  SUBSCRIBE_ON_AUTHORIZATION_UPDATED,
  SUBSCRIBE_ON_CHAT_CREATED,
  SUBSCRIBE_ON_USER_STATUS_UPDATED,
} from 'api/graphql'
import {ApolloClient} from 'api/manager'
import type {ApiChatSub, ApiSession, ApiUserStatusSub} from 'api/types'

import {cleanTypename} from 'utilities/cleanTypename'
import {logger} from 'utilities/logger'

import type {SignalGlobalState} from 'types/state'

import {type Actions, getActions} from './action'
import {getGlobalState} from './signal'

interface SubscribeResult {
  onChatCreated: ApiChatSub
  onAuthorizationCreated: ApiSession
  onAuthorizationUpdated: ApiSession
  onAuthorizationTerminated: ApiSession[]
  onUserStatusUpdated: ApiUserStatusSub
}
type SubscribeName = keyof SubscribeResult
export interface Subscription {
  closed: boolean
  unsubscribe(): void
}
const SUBSCRIBE_QUERY: Record<SubscribeName, DocumentNode> = {
  onChatCreated: SUBSCRIBE_ON_CHAT_CREATED,
  onAuthorizationCreated: SUBSCRIBE_ON_AUTHORIZATION_CREATED,
  onAuthorizationTerminated: SUBSCRIBE_ON_AUTHORIZATION_TERMINATED,
  onAuthorizationUpdated: SUBSCRIBE_ON_AUTHORIZATION_UPDATED,
  onUserStatusUpdated: SUBSCRIBE_ON_USER_STATUS_UPDATED,
}
export type Subscribes = {
  [key in SubscribeName]: () => void
}

const subscriptions = {} as Subscribes

const destroyers = {} as Partial<Record<SubscribeName, Subscription>>

const subscribeHandler = <N extends SubscribeName, TData extends SubscribeResult[N]>(
  name: N,
  handler: (data: TData) => void
) => {
  const subscription = ApolloClient.client.subscribe({query: SUBSCRIBE_QUERY[name]})

  return subscription.subscribe({
    next({data}) {
      const nestedObj = cleanTypename(
        (
          data as {
            [key in N]: TData
          }
        )[name]
      )
      handler(nestedObj /* unsubscribe */)
    },
    error(err) {
      // eslint-disable-next-line no-console
      console.error(err)
    },
  })
}

export function createSubscribe<N extends SubscribeName>(
  name: N,
  handler: (global: SignalGlobalState, actions: Actions, data: SubscribeResult[N]) => void
) {
  if (subscriptions[name]) {
    logger.error(`SUBSCRIBE ALREADY EXIST ${name}`)
    return
  }

  subscriptions[name] = () => {
    const sub = subscribeHandler(name, (data) => {
      const global = getGlobalState()
      const actions = getActions()
      handler(global, actions, data)
    })
    destroyers[name] = sub
  }
}

export function destroySubscribe<N extends SubscribeName>(name: N) {
  if (destroyers[name]) {
    destroyers[name]?.unsubscribe()
  } else {
    logger.error('UNSUBSCRIBE NOT FOUNDED')
  }
}

export function getSubscriptions() {
  return subscriptions
}

export function getActiveSubscriptions() {
  return destroyers
}

export function subscribeToAll() {
  Object.values(subscriptions).forEach((cb) => {
    cb()
  })
}

export function destroySubscribeAll() {
  Object.values(destroyers).forEach((d) => {
    d.unsubscribe()
  })
  // for (const cb in subscriptions) {
  //   if (cb in subscriptions) {
  //     destroySubscribe(cb as keyof Subscribes)
  //   }
  // }
}
