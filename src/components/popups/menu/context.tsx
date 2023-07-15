import { createContext } from 'preact'
import { type FC, type PropsWithChildren, useContext } from 'preact/compat'

interface MenuContextType {
  onClose: () => void
  isOpen: boolean
  autoClose: boolean
}
interface MenuProviderProps extends PropsWithChildren {
  props: MenuContextType
}

const MenuContext = createContext<MenuContextType | null>(null)

export const MenuProvider: FC<MenuProviderProps> = ({ props, children }) => {
  return <MenuContext.Provider value={props}>{children}</MenuContext.Provider>
}
export function useMenuContext() {
  const context = useContext(MenuContext)

  if (!context) {
    throw new Error('Cannot use «MenuContext» outside the «MenuProvider»')
  }

  return context
}
