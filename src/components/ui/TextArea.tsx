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

import clsx from 'clsx'

import {useLayout} from 'hooks/useLayout'

import type {SignalOr} from 'types/ui'

import './TextArea.scss'

interface TextAreaProps {
  onChange: (html: string) => void
  html: Signal<string>
  inputRef: RefObject<HTMLDivElement>
  placeholder?: SignalOr<string>
  isFocused: Signal<boolean>
}
const TextArea: FC<TextAreaProps> = ({onChange, html, inputRef, placeholder, isFocused}) => {
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
  }, [isMobile])

  useLayoutEffect(() => {
    inputRef.current?.focus()
  }, [])
  useSignalEffect(() => {
    // console.log{html:}, htmlRef.current)

    const inputV = inputRef.current!.innerHTML
    console.log({inputV, v: html.value})
    if (html.value !== inputRef.current!.innerHTML) {
      inputRef.current!.innerHTML = html.value

      // if(html.value==='\n\n' && inputRef.c)
    }
    if (html.value !== htmlRef.current) {
      htmlRef.current = html.value
      // if (html.value === '\n' || html.value === '\n\n') {
      //   html.value = ''
      //   console.log('А Я ХЗ ШО ЗА ХУЙНЯ ЦЕ')
      // }
      updateHeight()
    }
  })
  useSignalEffect(() => {
    if (isFocused?.value) {
      inputRef.current?.focus()
    } else {
      inputRef.current?.blur()
    }
  })
  const buildedClass = clsx('text-area scrollable scrollable-y scrollable-hidden', {
    'is-empty': html.value.length === 0,
  })
  return (
    <div class="text-area-wrapper" ref={inputScrollRef}>
      <div
        id="DALBAEB"
        contentEditable
        autofocus
        autoFocus
        onBlur={() => {
          isFocused.value = false
        }}
        // onSelect={() => {
        //   console.log('SELECT?')
        // }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            console.log('SEND MESSAGE', html.value)
          }
          if (event.key === 'Enter' && event.shiftKey) {
            console.log({v: html.value})
          }
        }}
        data-placeholder={placeholder}
        // placeholder="АХАХХ"
        ref={inputRef}
        class={buildedClass}
        onInput={handleChange}
      />

      {/* <div
        className={clsx('chat-input-inner', {
          'is-empty': html.value.length === 0,
        })}
      >

        <input
              // value={value}
              onInput={(e) => {
                console.log('LALALALLA')
              }}
              placeholder="daun"
              class="input-field"
            />
      </div> */}
    </div>
  )
}

export {TextArea}
