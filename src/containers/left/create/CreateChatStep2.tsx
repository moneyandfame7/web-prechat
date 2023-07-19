import {UploadPhoto} from 'components/UploadPhoto'
import {type FC, memo} from 'preact/compat'
import {LeftGoBack} from '../LeftGoBack'

export interface CreateChatStep2Props {
  isGroup: boolean
}
const CreateChatStep2: FC<CreateChatStep2Props> = ({isGroup}) => {
  return (
    <>
      <div class="LeftColumn-Header">
        <LeftGoBack force={false} />
        <p class="LeftColumn-Header_title">New {isGroup ? 'Group' : 'Channel'}</p>
      </div>
      <UploadPhoto />
      STEP 2 FOR {isGroup ? 'GROUP' : 'CHANNEL'}
    </>
  )
}

export default memo(CreateChatStep2)
