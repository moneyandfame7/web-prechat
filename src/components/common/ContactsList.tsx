import {type FC, memo} from 'preact/compat'

import {connect} from 'state/connect'

import {UserItem} from 'components/UserItem'

interface StateProps {
  contactIds: string[]
  withUrl?: boolean
}
const ContactsListImpl: FC<StateProps> = ({contactIds, withUrl}) => {
  return (
    <>
      {contactIds.map((c) => (
        <UserItem isContactList userId={c} key={c} withUrl={withUrl} />
      ))}
    </>
  )
}

export const ContactsList = memo(
  connect(
    (state): StateProps => ({
      contactIds: state.users.contactIds,
    })
  )(ContactsListImpl)
)
