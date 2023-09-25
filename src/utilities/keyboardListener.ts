export const IGNORED_KEY_CODES_FOR_FOCUS = [
  'Escape',
  'Tab',
  'Meta',
  'Shift',
  'Control',
  'Alt',
  'WindowsKeyCommand',
  'CapsLock',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  // 'ArrowUp', // idk
  // 'ArrowDown',
  // 'ArrowLeft',
  // 'ArrowRight',

  // 'Backspace', // handle later
  // 'Enter', // handle later
  'Insert',
  'Delete',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'PrintScreen',
  'ScrollLock',
  'PauseBreak',
]

type HandlerName =
  | 'onEnter'
  | 'onBackspace'
  | 'onDelete'
  | 'onEsc'
  | 'onUp'
  | 'onDown'
  | 'onLeft'
  | 'onRight'
  | 'onTab'
type Handler = (e: KeyboardEvent) => void | boolean | Promise<void>
type CaptureOptions = Partial<Record<HandlerName, Handler>>

const keyToHandlerName: Record<string, HandlerName> = {
  Enter: 'onEnter',
  Backspace: 'onBackspace',
  Delete: 'onDelete',
  Esc: 'onEsc',
  Escape: 'onEsc',
  ArrowUp: 'onUp',
  ArrowDown: 'onDown',
  ArrowLeft: 'onLeft',
  ArrowRight: 'onRight',
  Tab: 'onTab',
}

const handlers: Record<HandlerName, Handler[]> = {
  onEnter: [],
  onDelete: [],
  onBackspace: [],
  onEsc: [],
  onUp: [],
  onDown: [],
  onLeft: [],
  onRight: [],
  onTab: [],
}

export function addKeyboardListeners(options: CaptureOptions) {
  console.log('LALALALALLAL')
  if (!hasActiveHandlers()) {
    document.addEventListener('keydown', handleKeyDown, true)
  }

  ;(Object.keys(options) as Array<HandlerName>).forEach((handlerName) => {
    const handler = options[handlerName]
    if (!handler) {
      return
    }

    const currentEventHandlers = handlers[handlerName]
    if (currentEventHandlers) {
      currentEventHandlers.push(handler)
    }
  })

  return () => {
    releaseKeyboardListener(options)
  }
}

export function addEscapeListener(handler: VoidFunction) {
  return addKeyboardListeners({onEsc: handler})
}

function hasActiveHandlers() {
  return Object.values(handlers).some((keyHandlers) => Boolean(keyHandlers.length))
}

function handleKeyDown(e: KeyboardEvent) {
  const handlerName = keyToHandlerName[e.key]
  if (!handlerName) {
    return
  }

  const {length} = handlers[handlerName]
  if (!length) {
    return
  }

  for (let i = length - 1; i >= 0; i--) {
    const handler = handlers[handlerName][i]!
    if (handler(e) !== false) {
      e.stopPropagation()

      /* IF SAFARI AND ESCAPE - PREVENT DEFAULT */
      e.preventDefault()
      break
    }
  }
}

function releaseKeyboardListener(options: CaptureOptions) {
  ;(Object.keys(options) as Array<HandlerName>).forEach((handlerName) => {
    const handler = options[handlerName]
    const currentEventHandlers = handlers[handlerName]
    if (currentEventHandlers) {
      const index = currentEventHandlers.findIndex((cb) => cb === handler)
      if (index !== -1) {
        currentEventHandlers.splice(index, 1)
      }
    }
  })

  if (!hasActiveHandlers()) {
    document.removeEventListener('keydown', handleKeyDown, false)
  }
}
