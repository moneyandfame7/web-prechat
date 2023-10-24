import {type FC, memo} from 'preact/compat'

import {connect} from 'state/connect'

import {UserItem} from 'components/UserItem'

interface StateProps {
  contactIds: string[]
}
interface OwnProps {
  withUrl?: boolean
}
const ContactsListImpl: FC<StateProps & OwnProps> = ({contactIds, withUrl}) => {
  return (
    <>
      {contactIds.map((c) => (
        <UserItem isContactList userId={c} key={c} withUrl={withUrl} />
      ))}
    </>
  )
}

export const ContactsList = memo(
  connect<OwnProps, StateProps>((state) => ({
    contactIds: state.users.contactIds,
  }))(ContactsListImpl)
)
