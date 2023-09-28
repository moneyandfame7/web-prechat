import {type FC} from 'preact/compat'

import {TEST_translate} from 'lib/i18n'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {MenuItem} from 'components/popups/menu'
import {IconButton} from 'components/ui'
import {DropdownMenu} from 'components/ui/DropdownMenu'
import {ListItem} from 'components/ui/ListItem'

import {useLeftColumn} from './context'

export const Archived: FC = () => {
  const {resetScreen} = useLeftColumn()

  return (
    <ColumnWrapper
      headerContent={
        <DropdownMenu
          placement={{
            right: true,
            top: true,
          }}
          transform="top right"
          button={<IconButton icon="more" />}
          mount={false}
        >
          <MenuItem icon="settings">{TEST_translate('ArchiveSettings')}</MenuItem>
        </DropdownMenu>
      }
      onGoBack={resetScreen}
      title={TEST_translate('ArchivedChats')}
    >
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
    </ColumnWrapper>
  )
}
