import {memo, type FC} from 'preact/compat'

import {Button, FloatButton, Icon} from 'components/ui'

import {useLeftColumn} from '../context'

import './Contacts.scss'
const Contacts: FC = () => {
  const {resetScreen} = useLeftColumn()

  return (
    <>
      Contacts
      <Button onClick={resetScreen}>Reset</Button>
      <FloatButton
        shown
        className="CreateNewContact"
        aria-label="Create new Contact"
        icon={<Icon name="plus" />}
      />
    </>
  )
}

export default memo(Contacts)
