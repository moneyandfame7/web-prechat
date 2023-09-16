import {useSignal} from '@preact/signals'
import {type ChangeEvent, type FC, type TargetedEvent, memo} from 'preact/compat'

import clsx from 'clsx'

import {type MapState, connect} from 'state/connect'

import {Button, Icon, IconButton} from 'components/ui'

import './ChatInput.scss'

interface OwnProps {
  chatId: string
}
interface StateProps {}
const ChatInputImpl: FC<OwnProps & StateProps> = (/* {chatId} */) => {
  const value = useSignal('')

  const handleChange = (e: TargetedEvent<HTMLInputElement, ChangeEvent>) => {
    e.preventDefault()

    value.value = e.currentTarget.value

    // if(e.currentTarget)
  }

  return (
    <div class="chat-input-wrapper">
      <div class="chat-input">
        <IconButton icon="smile" />
        <div
          className={clsx('chat-input-inner', {
            'is-empty': value.value.length === 0,
          })}
        >
          <div data-placeholder="Message" class="input-field-fake" />

          <input value={value} onInput={handleChange} placeholder="daun" class="input-field" />
        </div>
        <IconButton icon="attach" />
      </div>
      <Button isDisabled={value.value.length === 0} className="send-button">
        {/* L */}
        <Icon name="send" />
      </Button>
    </div>
  )
}

const mapStateToProps: MapState<OwnProps, StateProps> = (/* state, ownProps */) => {
  return {}
}
export const ChatInput = memo(connect(mapStateToProps)(ChatInputImpl))
