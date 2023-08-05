import {render} from 'preact'
import {ApolloProvider} from '@apollo/client'

import {Application} from 'modules/App'

import {initializeApplication} from 'state/initialize'

import {ApolloClient} from 'api/manager'

import './state/actions/ui/init'

import './state/actions/ui/init'

import './css/index.scss'

async function init() {
  // eslint-disable-next-line no-console
  console.time('Initializing')
  await initializeApplication()
    .then(() => {
      // eslint-disable-next-line no-console
      console.timeEnd('Initializing')
    })
    .catch((err) => {
      console.warn({err})
    })
}
init()
render(
  <ApolloProvider client={ApolloClient.getClient()}>
    <Application />
  </ApolloProvider>,
  document.getElementById('app') as HTMLElement
)
