import 'preact/debug'
import { render } from 'preact'
import { ApolloProvider } from '@apollo/client'

import { client } from 'api/client'
import { Application } from 'modules/App'

import { initializeApplication } from 'state/initialize'

import './css/index.scss'

async function init() {
  // eslint-disable-next-line no-console
  console.time('Initializing')

  await initializeApplication().then(() => {
    // eslint-disable-next-line no-console
    console.timeEnd('Initializing')
  })
}
init()
render(
  <ApolloProvider client={client}>
    <Application />
  </ApolloProvider>,
  document.getElementById('app') as HTMLElement
)
