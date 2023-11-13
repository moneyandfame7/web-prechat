import type {RefObject} from 'preact'

export function insertTextAtCursor(text: string, inputRef: RefObject<HTMLDivElement>) {
  if (!isSelectionInElement(inputRef)) {
    console.log('NY TI EBLAN?')
    return
  }
  const sel = window.getSelection()
  const range = sel?.getRangeAt(0)

  if (!range || !sel?.rangeCount) {
    return
  }
  range.deleteContents()
  const textNode = document.createTextNode(text)
  range.insertNode(textNode)
  range.setStartAfter(textNode)
  sel?.removeAllRanges()
  sel?.addRange(range)
  inputRef.current?.dispatchEvent(new Event('input', {bubbles: true})) // щоб відбувся евент і пропав placeholder, змінилась висота і т.д
}

export function insertCursorAtEnd(inputRef: RefObject<HTMLDivElement>) {
  if (!isSelectionInElement(inputRef) || !inputRef.current) {
    console.log('NY TI EBLAN? 222')
    return
  }

  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(inputRef.current)
  range.collapse(false) // Встановлюємо курсор в кінець
  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function isSelectionInElement(inputRef: RefObject<HTMLDivElement>) {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) {
    return false
  }

  const range = selection.getRangeAt(0)
  const element = inputRef.current
  if (!element) {
    return false
  }

  const startContainer = range.startContainer
  const endContainer = range.endContainer

  if (startContainer === element || element.contains(startContainer)) {
    return true
  }

  if (endContainer === element || element.contains(endContainer)) {
    return true
  }

  return false
}

// const checkSelectionInElement = (inputRef: RefObject<HTMLDivElement>) => {
//   const targetElement = inputRef.current

//   if (targetElement) {
//     const selection = window.getSelection()

//     if (selection) {
//       const range = selection.getRangeAt(0)
//       if (range) {
//         const containerNode = range.commonAncestorContainer
//         if (
//           containerNode.nodeType === 1 &&
//           (containerNode as HTMLElement)?.id === inputRef.current?.id
//         ) {
//           console.log('Selection is inside the target element.')
//         } else {
//           console.log('Selection is NOT inside the target element.')
//         }
//       }
//     }
//   }
// }
