export function stopEvent(e: Event) {
  e.stopPropagation()
  e.stopImmediatePropagation()
  e.preventDefault()
}
