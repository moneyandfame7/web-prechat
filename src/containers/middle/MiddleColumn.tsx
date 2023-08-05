import {useRef, type FC, useState} from 'preact/compat'

import {Button} from 'components/ui'

import './MiddleColumn.scss'
import {getGlobalState} from 'state/signal'
import ls from 'localstorage-slim'
import {INITIAL_STATE, initStatePersist, setGlobalState} from 'state/persist'

export const MiddleColumn: FC = () => {
  const render = useRef(0)
  const global = getGlobalState()

  render.current += 1
  const persist = () => {
    ls.set('STATE', global, {encrypt: false, secret: 1488})
  }

  const update = () => {
    Object.assign(global, INITIAL_STATE)

    persist()
  }

  const changeNumber = () => {
    global.auth.phoneNumber = 'NINE STHEFAN'
  }

  return (
    <div class="MiddleColumn">
      <div class="MiddleColumn-inner">
        <h1>{render.current}</h1>
        {global.auth.$phoneNumber}
        {global.auth.$email}
        <Button onClick={persist}>PERSIST</Button>
        <Button onClick={update}>UPDATE</Button>
        <Button onClick={changeNumber}>CHANGE PHONE</Button>
      </div>
    </div>
  )
}
