import {RightColumnScreens} from 'types/screens'

import {createScreenContext} from './screens'

export const RightColumnContext = createScreenContext<
  RightColumnScreens,
  typeof RightColumnScreens
>(RightColumnScreens, 'Settings')
