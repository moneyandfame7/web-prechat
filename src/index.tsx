// import 'preact/debug'
import {render} from 'preact'
import {ApolloProvider} from '@apollo/client'

import {Application} from 'modules/App'

import {initializeApplication} from 'state/initialize'

import {ApolloClient} from 'api/client'

import './css/index.scss'
// import {effect} from '@preact/signals'
// import {getGlobalState} from 'state/signal'

async function init() {
  // const state = getGlobalState()
  // eslint-disable-next-line no-console
  console.time('Initializing')
  await initializeApplication().then(() => {
    // eslint-disable-next-line no-console
    console.timeEnd('Initializing')
  })
  /* якщо потрібні якісь підписки в auth - перед переходом в main - unsubscribe from all  */
  // state.auth.$rememberMe!.subscribe((state) => {
  //   console.log('WAS CHANGED')
  // })
  // effect(() => console.log(state.auth, 'REMEMBER ME???'))
}
init()
render(
  <ApolloProvider client={ApolloClient.getClient()}>
    <Application />
  </ApolloProvider>,
  document.getElementById('app') as HTMLElement
)
