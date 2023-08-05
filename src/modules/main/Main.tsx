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
    // getContactList()
  }, [])
  return (
    <div class="Main">
      <LeftColumn />
      <MiddleColumn />
      <RightColumn />
    </div>
  )
}

export default memo(Main)
