import {type FC, memo, useEffect} from 'preact/compat'

import 'state/actions/all'

import {MiddleColumn} from 'containers/middle'
import LeftColumn from 'containers/left/LeftColumn'
import RightColumn from 'containers/right/RightColumn'

import {getActions} from 'state/action'

import './Main.scss'

const Main: FC = () => {
  const {getContactList} = getActions()

  useEffect(() => {
    getContactList()
  }, [])
  return (
    <div class="Main">
      <LeftColumn />
      {/* <SwitchLanguageTest /> */}
      {/* <p>DORA DURA DORA DURA</p> */}
      {/* <p>{t('Auth.StartMessaging')}</p> */}
      <MiddleColumn />
      <RightColumn />
    </div>
  )
}

export default memo(Main)
