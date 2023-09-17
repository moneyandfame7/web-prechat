import {render} from 'preact'

import {ApolloProvider} from '@apollo/client'

import {Application} from 'modules/App'

import {ApolloClient} from 'api/manager'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'

import {DEBUG} from 'common/environment'

import './css/index.scss'

/**
 * @todo For lottie components add intersection observer
 * stop if not in view.
 * @supports backdrop-blur: mixin. accept color and value for blur
 *
 * @todo - Messages:
 *  > Sending, getting.
 *  > Unread count.
 *  > Infinite scroll.
 *  > Media, emoji uploading, documents ( voice ?).
 *  > Contacts, Poll.
 * @todo - Media (photo/vide):
 *  > Blurhash.
 *    > for video - need to get first frame and blur hash it??
 *    > for photo - just get hash
 */
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

    window.addEventListener('dblclick', () => {
      // eslint-disable-next-line no-console
      console.log(global)
    })
  }
}

init()
render(
  /* @ts-expect-error Preact type confused */
  <ApolloProvider client={ApolloClient.getClient()}>
    {/* @ts-expect-error Preact type confused  */}
    <Application />
  </ApolloProvider>,
  document.getElementById('app') as HTMLElement
)
