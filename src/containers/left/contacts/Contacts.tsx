import {type FC, memo, useCallback} from 'preact/compat'

import {getActions} from 'state/action'

import {TEST_translate} from 'lib/i18n'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {ContactsList} from 'components/common/ContactsList'
import {FloatButton, Icon} from 'components/ui'

import {useLeftColumn} from '../context'

import './Contacts.scss'

const Contacts: FC = () => {
  const {openCreateContactModal} = getActions()
  const {resetScreen} = useLeftColumn()

  const handleClickButton = useCallback(() => {
    openCreateContactModal()
  }, [openCreateContactModal])

  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('Contacts')}>
      {/* Contacts */}
      <ContactsList />
      <FloatButton
        shown
        onClick={handleClickButton}
        className="CreateNewContact"
        aria-label="Create new Contact"
        icon={<Icon name="plus" />}
      />
    </ColumnWrapper>
  )
}

export default memo(Contacts)
