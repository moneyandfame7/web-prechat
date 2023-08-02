import {type FC} from 'preact/compat'

import {getGlobalState} from 'state/signal'
import {updateGlobalState} from 'state/persist'
import {Button} from 'components/ui'
import {AuthScreens} from 'types/screens'

import './Chats.scss'

export const Chats: FC = () => {
  return (
    <>
      <h1>Chats</h1>
    </>
  )
}
