import {type FC, memo} from 'preact/compat'

import type {ApiUser} from 'api/types'

// import {RightColumnContext} from 'context/right-column'
import {getActions} from 'state/action'

import {RightColumnScreens} from 'types/screens'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {AvatarTest} from 'components/ui/AvatarTest'

export interface OwnProps {
  user: ApiUser
}
const EditContact: FC<OwnProps> = ({user}) => {
  // const {resetScreen} = RightColumnContext.useScreenContext()
  const {openRightColumn, updateContact, deleteContact} = getActions()
  return (
    <ColumnWrapper
      onGoBack={() => {
        openRightColumn({screen: RightColumnScreens.ChatProfile})
      }}
      title="Edit contact"
    >
      <AvatarTest size="xxl" peer={user} />
      <h4>Lorem</h4>
      <h4>Lorem</h4>
      <h4>Lorem</h4>
      <h4>Lorem</h4>
    </ColumnWrapper>
  )
}

export default memo(EditContact)
