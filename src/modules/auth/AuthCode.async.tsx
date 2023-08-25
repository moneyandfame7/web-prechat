import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

const AuthCodeAsync: FC = props => {
  const AuthCode = useLazyComponent('AuthCode')

  return AuthCode ? <AuthCode {...props} /> : null
}

export default memo(AuthCodeAsync)
