import type {FunctionComponent, VNode} from 'preact'
import {createPortal} from 'preact/compat'

interface PortalProps {
  children: VNode
}
export const Portal: FunctionComponent<PortalProps> = ({children}) => {
  return createPortal(children, document.getElementById('portal')!)
}
