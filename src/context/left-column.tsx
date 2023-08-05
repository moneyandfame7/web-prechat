import {LeftColumnGroup, type LeftColumnScreen} from 'types/ui'

import {createScreenContext} from './screens'

export const LeftColumnContext = createScreenContext<
  LeftColumnScreen,
  typeof LeftColumnGroup
>(LeftColumnGroup, 'LeftColumn')
