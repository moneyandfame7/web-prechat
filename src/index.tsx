import { render } from 'preact'
import { ApolloProvider } from '@apollo/client'

import { client } from 'api/client'
import { Application } from 'modules/App'

import './css/index.scss'

render(
  <ApolloProvider client={client}>
    <Application />
  </ApolloProvider>,
  document.getElementById('app') as HTMLElement
)
