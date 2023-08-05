import {ListItem} from 'components/ui/ListItem'
import type {FC} from 'preact/compat'
import {selectChat} from 'state/selectors/chats'
import {getGlobalState} from 'state/signal'

interface ChatProps {
  chatId: string
}
export const Chat: FC<ChatProps> = ({chatId}) => {
  const global = getGlobalState()
  const chat = selectChat(global, chatId)
  return (
    <ListItem
      withRipple
      onClick={() => {
        /*  */
      }}
    >
      <>
        <h4>{chat.title}</h4>

        <h6>{chat.id}</h6>
      </>
    </ListItem>
  )
}
