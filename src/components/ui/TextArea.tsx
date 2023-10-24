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
  className?: string
  wrapperClassName?: string
  autoFocus?: boolean
  tabIndex?: number
  isInputHelperActive?: boolean
}
const TextArea: FC<TextAreaProps> = ({
  onChange,
  html,
  inputRef,
  placeholder,
  isFocused,
  className,
  autoFocus = true,
  tabIndex = 0,
  wrapperClassName,
  isInputHelperActive,
}) => {
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

  // useEffect(() => {
  //   updateHeight()
  // }, [isInputHelperActive])
  const htmlRef = useRef(html.value)
  // const focusedRef = useRef(isFocused.value)
  const handleChange = useCallback(
    (e: TargetedEvent<HTMLDivElement, ChangeEvent>) => {
      const textarea = inputRef.current
      const scroller = inputScrollRef.current
      if (!textarea || !scroller) {
        return
      }
      e.preventDefault()
      const {innerHTML} = textarea
      console.log({innerHTML})
      onChange(
        innerHTML === '<br>' || innerHTML === '&nbsp;' || innerHTML === '\n' ? '' : innerHTML
      )
    },
    [onChange]
  )
  useLayoutEffect(() => {
    updateHeight()
  }, [isMobile])

  // useLayoutEffect(() => {
  //   inputRef.current?.focus()
  // }, [])
  useSignalEffect(() => {
    // console.log{html:}, htmlRef.current)
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

  const isFocusedRef = useRef(isFocused.value)

  useSignalEffect(() => {
    if (isFocused.value !== isFocusedRef.current) {
      isFocusedRef.current = isFocused.value
      if (isFocused.value) {
        inputRef.current?.focus()
      } else {
        inputRef.current?.blur()
      }
    }
  })
  useLayoutEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [])

  // useSignalEffect(() => {
  //   const value = isFocused.value
  //   console.log(value, focusedRef.current)
  //   if (value !== focusedRef.current) {
  //     if (value) {
  //       inputRef.current?.focus()
  //     } else {
  //       inputRef.current?.blur()
  //     }
  //   }
  // })
  // useSignalEffect(() => {
  // })
  const buildedClass = clsx('text-area scrollable scrollable-y scrollable-hidden', className, {
    'is-empty': html.value.length === 0,
  })
  return (
    <div class={`text-area-wrapper ${'' + wrapperClassName || ''}`} ref={inputScrollRef}>
      <div
        tabIndex={tabIndex}
        id="DALBAEB"
        contentEditable
        // autofocus
        // autoFocus
        onBlur={() => {
          isFocused.value = false
        }}
        onFocus={() => {
          isFocused.value = true
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
