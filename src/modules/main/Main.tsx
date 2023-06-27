import { FC, memo } from 'preact/compat'

import { MiddleColumn } from 'containers/middle'
import 'state/actions/all'
import { SwitchLanguageTest } from 'components/test/SwitchLanguage'
import { t } from 'lib/i18n'

const Main: FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <SwitchLanguageTest />
      <p>DORA DURA DORA DURA</p>
      <p>{t('Auth.StartMessaging')}</p>
      <MiddleColumn />
    </div>
  )
}

export default memo(Main)
