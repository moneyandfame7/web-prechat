import { render } from 'preact'
import { ApolloProvider } from '@apollo/client'

import { client } from 'api/client'
import { Application } from 'modules/App'

import { initializeApplication } from 'state/initialize'

import './css/index.scss'

async function init() {
  const start = Date.now()

  await initializeApplication().then(() => {
    // eslint-disable-next-line no-console
    console.log('Initializing', Date.now() - start, 'ms')
  })
}
init()
render(
  <ApolloProvider client={client}>
    <Application />
  </ApolloProvider>,
  document.getElementById('app') as HTMLElement
)
