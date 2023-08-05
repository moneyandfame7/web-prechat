import {createContext} from 'preact'
import {type FC, type PropsWithChildren, useContext} from 'preact/compat'

interface IModalContext {
  onClose: () => void
  isOpen: boolean
  hasCloseButton: boolean
}
interface ModalProviderProps extends PropsWithChildren {
  value: IModalContext
}

const ModalContext = createContext<IModalContext | null>(null)

export const ModalProvider: FC<ModalProviderProps> = ({children, value}) => {
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
export function useModalContext() {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('Cannot use ModalContext outside the «ModalProvider»')
  }

  return context
}
