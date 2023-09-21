import {render} from 'preact'

import {ApolloProvider} from '@apollo/client'

import {Application} from 'modules/App'

import {ApolloClient} from 'api/manager'

import {getActions} from 'state/action'
import {getGlobalState} from 'state/signal'
import {subscribeToSyncUpdate} from 'state/sync'

import {DEBUG} from 'common/environment'

import './css/index.scss'

/**
 * share state between tabs ( broadcast channel, check support )
 * also need to refactor code, remove unused updates, fix monkey flickering
 * fix apollo retry
 * @todo For lottie components add intersection observer
 * stop if not in view.
 * @supports backdrop-blur: mixin. accept color and value for blur
 *
 * @todo - Settings:
 * > Animation level - 1, 2 ?
 *  > if 1 - just fade, 2 - great
 *  > or off
 * @todo - Messages:
 *  > Sending, getting.
 *     > **Getting**:
 *       - limit ( 50 pagination)
 *  > Unread count.
 *  > Read/unread - https://www.youtube.com/watch?v=Roa71K-5R74
 *  > Infinite scroll.
 *  > StyledEntities - https://chat.openai.com/c/873afe8c-ee0e-4725-8be6-101e1f9eb0d4
 *   > url, email, phone, url-in-text, hashtag, mentions and others ( check core telegram api)
 *  > Media, emoji uploading, documents ( voice ?).
 *  > Contacts, Poll.
 *  > Translating:
 *   > Translate Modal
 *
 * @todo - Chat folders:
 * > getChatFolders - method API.
 * > sortChatFolders - method API.
 * > deleteChatFolder - method API.
 * > updateChatFolder - method API.
 *   > change name, icon...
 * > defaultFolderIndex
 *
 * @todo - Emoji:
 *  > renderText() function? (for avatar, nicknames and other shit)
 *  > Rewrite chat input on div and there paste img
 *  >> https://www.youtube.com/watch?v=vsIDc9FTxzM
 *
 * @todo - Media (photo/vide):
 * https://stackblitz.com/edit/react-ts-bwsqfc?file=App.tsx
 *  > Blurhash.
 *    > for video - need to get first frame and blur hash it??
 *    > for photo - just get hash
 *
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

  subscribeToSyncUpdate()
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
