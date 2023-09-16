import {render} from 'preact'

import {ApolloProvider} from '@apollo/client'

import {Application} from 'modules/App'

import {ApolloClient} from 'api/manager'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {DEBUG} from 'common/config'

import './css/index.scss'

async function init() {
  // eslint-disable-next-line no-console
  console.time('>>> INIT <<<')
  const actions = getActions()

  await actions.init()
  // await uiStore.actions.init()

  // eslint-disable-next-line no-console
  console.timeEnd('>>> INIT <<<')

  // await initializeApplication()
  //   .then(() => {
  //     // eslint-disable-next-line no-console
  //     console.timeEnd('Initializing')
  //   })
  //   .catch((err) => {
  //     console.warn({err})
  //   })
  if (DEBUG) {
    import('preact/debug')
    const global = getGlobalState()

    window.addEventListener('dblclick', (ev) => {
      console.log(global)
    })
  }
}

init()
render(
  <ApolloProvider client={ApolloClient.getClient()}>
    <Application />
  </ApolloProvider>,
  document.getElementById('app') as HTMLElement
)
