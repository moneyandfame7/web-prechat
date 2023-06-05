import { FC, memo } from 'preact/compat'

import './AuthPhoneNumber.scss'

const AuthPhoneNumber: FC = () => {
  return (
    <>
      <h1>Prechat auth number</h1>
      <input class="form-input" placeholder="ШВИДКО КАЖИ!" />
    </>
  )
}

export default memo(AuthPhoneNumber)
