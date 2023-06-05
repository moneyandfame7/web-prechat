import { FC, memo, useEffect } from 'preact/compat'

import AuthCode from './AuthCode.async'
import AuthPassword from './AuthPassword.async'
import AuthPhoneNumber from './AuthPhoneNumber'
import './auth.scss'

const Auth: FC = () => {
  useEffect(() => {
    document.title = 'Auth page'
  }, [])
  return (
    <div className="Auth">
      <h1>Prechat authorization</h1>
      <AuthCode />
      <AuthPassword />
      <AuthPhoneNumber />
    </div>
  )
}

export default memo(Auth)
