import {useCallback, type FC, type PropsWithChildren} from 'preact/compat'
import {LeftColumnScreen} from 'types/ui'
import {LeftMainMenu} from './main/MainMenu'
import {LeftGoBack} from './LeftGoBack'

import {useLeftColumn} from './context'

interface LeftHeaderProps extends PropsWithChildren {}
export const LeftHeader: FC<LeftHeaderProps> = ({children}) => {
  const {activeScreen} = useLeftColumn()

  const renderButton = useCallback(() => {
    switch (activeScreen) {
      case LeftColumnScreen.Chats:
        return <LeftMainMenu />
      default:
        return <LeftGoBack />
    }
  }, [activeScreen])

  return (
    <div class="LeftColumn-Header">
      {renderButton()}
      {children}
    </div>
  )
}
