import {type FC, type PropsWithChildren, useCallback} from 'preact/compat'

import {LeftColumnScreen} from 'types/screens'

import {ColumnHeader} from 'components/ColumnHeader'

import {LeftGoBack} from './LeftGoBack'
import {useLeftColumn} from './context'
import {LeftMainMenu} from './main/MainMenu'

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
    <ColumnHeader className="LeftColumn-Header">
      {renderButton()}
      {children}
    </ColumnHeader>
  )
}
