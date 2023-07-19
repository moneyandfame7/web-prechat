import {type FC, memo, useCallback} from 'preact/compat'
import {LeftGoBack} from '../LeftGoBack'
import {FloatButton, Icon} from 'components/ui'
import {useLeftColumn} from '../context'
import {LeftColumnScreen} from 'types/ui'

export interface CreateChatStep1Props {
  isGroup: boolean
}
const CreateChatStep1: FC<CreateChatStep1Props> = ({isGroup}) => {
  const {setScreen} = useLeftColumn()
  const handleNextStep = useCallback(() => {
    setScreen(isGroup ? LeftColumnScreen.NewGroupStep2 : LeftColumnScreen.NewChannelStep2)
  }, [isGroup])
  return (
    <>
      <div class="LeftColumn-Header">
        <LeftGoBack />
        <p class="LeftColumn-Header_title">Add Members</p>
      </div>
      New {isGroup ? 'Group' : 'Channel'}
      <FloatButton
        onClick={handleNextStep}
        icon={<Icon name="arrowRight" />}
        aria-label="Next step"
      />
    </>
  )
}

export default memo(CreateChatStep1)
