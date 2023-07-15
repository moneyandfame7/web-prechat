import type { RefObject } from 'preact'

import { useEventListener } from './useEventListener'

type ClickAwayHandler = (e: MouseEvent, el: HTMLElement) => void
export const useClickAway = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: ClickAwayHandler
) => {
  useEventListener('mousedown', (event) => {
    const el = ref?.current
    const clicked = event.target as HTMLElement
    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(clicked)) {
      return
    }

    handler(event, clicked)
  })
}
