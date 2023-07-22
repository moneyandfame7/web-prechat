import {type RefObject} from 'preact'
import {useCallback} from 'preact/hooks'
import {type FC, type TargetedEvent, memo} from 'preact/compat'

import type {InputHandler} from 'types/ui'

import {t} from 'lib/i18n'

import {InputText} from './Input'

import './SearchInput.scss'

interface SearchInputProps {
  value: string
  onInput: (value: string) => void
  onFocus?: InputHandler
  placeholder?: string
  elRef: RefObject<HTMLInputElement>
}
export const SearchInput: FC<SearchInputProps> = memo(
  ({value, onInput, placeholder = 'Search', onFocus, elRef}) => {
    const handleChangeInput = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
      onInput(e.currentTarget.value)
    }, [])

    return (
      <div class="SearchInput">
        <InputText
          aria-label={t('Search')}
          elRef={elRef}
          value={value}
          onFocus={onFocus}
          onInput={handleChangeInput}
          placeholder={placeholder || t('Search')}
          startIcon="search"
        />
      </div>
    )
  }
)
