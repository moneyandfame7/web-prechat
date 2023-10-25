import {type FC, memo, useLayoutEffect, useRef} from 'preact/compat'

import {TEST_translate} from 'lib/i18n'

import type {InputHandler} from 'types/ui'

import {InputText} from './Input'

import './SearchInput.scss'

interface SearchInputProps {
  value: string
  onInput: (value: string) => void
  onFocus?: InputHandler
  placeholder?: string
  isFocused: boolean
}

export const SearchInput: FC<SearchInputProps> = memo(
  ({value, onInput, placeholder = 'Search', onFocus, isFocused}) => {
    const handleOnInput: InputHandler = (e) => {
      e.preventDefault()
      onInput(e.currentTarget.value)
    }
    const inputRef = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
      if (isFocused) {
        inputRef.current?.focus()
      } else {
        inputRef.current?.blur()
      }
    }, [isFocused])
    return (
      <div class="SearchInput">
        <InputText
          elRef={inputRef}
          aria-label={TEST_translate('Search')}
          value={value}
          onFocus={onFocus}
          onInput={handleOnInput}
          placeholder={placeholder || TEST_translate('Search')}
          startIcon="search"
        />
      </div>
    )
  }
)
