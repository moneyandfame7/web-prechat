import {type FC, memo} from 'preact/compat'

import {SettingsContext} from 'context/settings'

import {TEST_translate} from 'lib/i18n'
import {LottiePlayer} from 'lib/lottie'

import {SettingsScreens} from 'types/screens'

import {ColumnSection} from 'containers/left/ColumnSection'

import {ColumnWrapper} from 'components/ColumnWrapper'
import {Button} from 'components/ui'
import {ListItem} from 'components/ui/ListItem'

import './styles.scss'

const ChatFolders: FC = () => {
  const {resetScreen, setScreen} = SettingsContext.useScreenContext()
  return (
    <ColumnWrapper title={TEST_translate('Folders.ChatFolders')} onGoBack={resetScreen}>
      <LottiePlayer autoplay className="ml-auto mr-auto" size="small" name="folders-1" />
      <p class="info">{TEST_translate('Folders.ChatFoldersInfo')}</p>

      <Button
        className="add-folder-btn"
        iconPosition="start"
        icon="plus"
        uppercase={false}
        shape="rounded"
        fullWidth={false}
      >
        {TEST_translate('Folders.CreateFolder')}
      </Button>
      <ColumnSection title={TEST_translate('Folders')}>
        <ListItem
          title="Mock 1"
          onClick={() => {
            setScreen(SettingsScreens.ChatFoldersEdit)
          }}
        />
        <ListItem
          onClick={() => {
            setScreen(SettingsScreens.ChatFoldersEdit)
          }}
          title="Mock 2"
        />
      </ColumnSection>

      <ColumnSection title={TEST_translate('FoldersRecommended')}>
        <ListItem title="mock1" subtitle="lalal" childrenPosition="end">
          <Button uppercase={false} shape="rounded" fullWidth={false}>
            {TEST_translate('Add')}
          </Button>
        </ListItem>
      </ColumnSection>
    </ColumnWrapper>
  )
}

export default memo(ChatFolders)
