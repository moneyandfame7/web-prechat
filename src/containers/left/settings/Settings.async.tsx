import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import {ScreenLoader} from 'components/ScreenLoader'

import type {SettingsProps} from './Settings'

const SettingsAsync: FC<SettingsProps> = (props) => {
  const Settings = useLazyComponent('Settings')
  return Settings ? <Settings {...props} /> : <ScreenLoader />
}

export default memo(SettingsAsync)
