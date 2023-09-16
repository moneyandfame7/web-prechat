import {type FC, memo} from 'preact/compat'

import {type MapState, connect} from 'state/connect'

import type {ChatEditScreens} from 'types/screens'

import {ColumnWrapper} from 'components/ColumnWrapper'

export interface ChatEditProps {
  chatId: string
  onCloseScreen: () => void
  currentScreen: ChatEditScreens
}
interface StateProps {}
const ChatEdit: FC<ChatEditProps> = ({chatId, onCloseScreen}) => {
  return (
    <ColumnWrapper title="Edit" onGoBack={onCloseScreen}>
      Chat edit {chatId}
    </ColumnWrapper>
  )
}

const mapStateToProps: MapState<ChatEditProps, StateProps> = (/* state, ownProps */) => {
  return {}
}

export default memo(connect(mapStateToProps)(ChatEdit))
