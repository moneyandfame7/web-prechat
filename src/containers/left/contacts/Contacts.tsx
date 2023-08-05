import {memo, type FC, useCallback} from 'preact/compat'

import {Button, FloatButton, Icon} from 'components/ui'
import {getActions} from 'state/action'

import {useLeftColumn} from '../context'

import './Contacts.scss'

const Contacts: FC = () => {
  const {openCreateContactModal} = getActions()
  const {resetScreen} = useLeftColumn()

  const handleClickButton = useCallback(() => {
    openCreateContactModal()
  }, [openCreateContactModal])

  return (
    <>
      Contacts
      <Button onClick={resetScreen}>Reset</Button>
      <FloatButton
        shown
        onClick={handleClickButton}
        className="CreateNewContact"
        aria-label="Create new Contact"
        icon={<Icon name="plus" />}
      />
    </>
  )
}

export default memo(Contacts)
