import type {DocumentNode} from '@apollo/client'

import type {ApiChatSub} from 'api/types/subscriptions'
import {ApolloClient} from 'api/manager'
import {SUBSCRIBE_ON_CHAT_CREATED} from 'api/graphql/chats'

import type {SignalGlobalState} from 'types/state'

import {logger} from 'utilities/logger'
import {cleanTypename} from 'utilities/cleanTypename'

import {getGlobalState} from './signal'
import {getActions, type Actions} from './action'

interface SubscribeResult {
  onChatCreated: ApiChatSub
}
type SubscribeName = keyof SubscribeResult
export interface Subscription {
  closed: boolean
  unsubscribe(): void
}
const SUBSCRIBE_QUERY: Record<SubscribeName, DocumentNode> = {
  onChatCreated: SUBSCRIBE_ON_CHAT_CREATED,
}
type Subscribes = {
  [key in SubscribeName]: () => void
}

const subscriptions = {} as Subscribes

const unsubscribers = {} as Partial<Record<SubscribeName, Subscription>>

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
    const sub = subscribeHandler(name, data => {
      const global = getGlobalState()
      const actions = getActions()
      handler(global, actions, data)
    })
    unsubscribers[name] = sub
  }
}

export function destroySubscribe<N extends SubscribeName>(name: N) {
  if (unsubscribers[name]) {
    unsubscribers[name]?.unsubscribe()
  } else {
    logger.error('UNSUBSCRIBE NOT FOUNDED')
  }
}

export function getSubscriptions() {
  return subscriptions
}
