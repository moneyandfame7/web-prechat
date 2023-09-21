import {type Signal, useSignalEffect} from '@preact/signals'
import {
  type ChangeEvent,
  type FC,
  type RefObject,
  type TargetedEvent,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'preact/compat'

import {useLayout} from 'hooks/useLayout'

import './TextArea.scss'

interface TextAreaProps {
  onChange: (html: string) => void
  html: Signal<string>
  inputRef: RefObject<HTMLDivElement>
}
const TextArea: FC<TextAreaProps> = ({onChange, html, inputRef}) => {
  const inputScrollRef = useRef<HTMLDivElement>(null)

  const {isMobile} = useLayout()

  const maxInputHeight = isMobile ? 215 : 350
  const updateHeight = () => {
    const textarea = inputRef.current
    const scroller = inputScrollRef.current
    if (!textarea || !scroller) {
      return
    }
    const newHeight = Math.min(textarea.scrollHeight, maxInputHeight)
    scroller.style.height = `${newHeight}px`
  }

  const htmlRef = useRef(html.value)

  const handleChange = useCallback(
    (e: TargetedEvent<HTMLDivElement, ChangeEvent>) => {
      const textarea = inputRef.current
      const scroller = inputScrollRef.current
      if (!textarea || !scroller) {
        return
      }
      e.preventDefault()

      const {innerHTML} = textarea
      onChange(innerHTML === '<br>' ? '' : innerHTML)
    },
    [onChange]
  )
  useLayoutEffect(() => {
    updateHeight()
  })

  useSignalEffect(() => {
    if (html.value !== inputRef.current!.innerHTML) {
      inputRef.current!.innerHTML = html.value
    }
    if (html.value !== htmlRef.current) {
      htmlRef.current = html.value

      updateHeight()
    }
  })

  return (
    <div class="input-scroll" ref={inputScrollRef}>
      <div
        id="DALBAEB"
        contentEditable
        // onSelect={() => {
        //   console.log('SELECT?')
        // }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            console.log('SEND MESSAGE')
          }
        }}
        ref={inputRef}
        class="text-area scrollable scrollable-y scrollable-hidden"
        onInput={handleChange}
      />
    </div>
  )
}

export {TextArea}
