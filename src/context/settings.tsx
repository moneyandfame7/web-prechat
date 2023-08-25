import {SettingsGroup, type SettingsScreens} from 'types/screens'

import {createScreenContext} from './screens'

/* rename screens to group! */
export const SettingsContext = createScreenContext<SettingsScreens, typeof SettingsGroup>(
  SettingsGroup,
  'Settings'
)
// SettingsContext.classNames.
