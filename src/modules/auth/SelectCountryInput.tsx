import {
  type FC,
  type TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat'

import type {ApiCountry} from 'api/types/langPack'

import {t} from 'lib/i18n'

import {TRANSITION_DURATION_ZOOM_FADE} from 'common/config'

import {Menu, MenuItem} from 'components/popups/menu'
import {Icon, InputText} from 'components/ui'

// import {parseEmoji} from 'utilities/parseEmoji'
import './SelectCountryInput.scss'

interface SelectCountryInputProps {
  countryList: ApiCountry[]
  selectedCountry?: ApiCountry
  loading: boolean
  handleSelect: (country: ApiCountry) => void
}
export const SelectCountryInput: FC<SelectCountryInputProps> = memo(
  ({countryList, selectedCountry, loading, handleSelect}) => {
    const [isOpen, setIsOpen] = useState(false)
    const authScroll = document.getElementById('auth-scroll')
    const [stringName, setStringName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const handleOnFocus = useCallback(() => {
      if (loading) return

      inputRef.current?.select()

      setIsOpen(true)
      setTimeout(() => {
        authScroll?.scrollTo({top: authScroll.scrollHeight, behavior: 'smooth'})
      }, 100)
    }, [countryList, selectedCountry, loading, authScroll])

    const handleOnBlur = useCallback(() => {
      setIsOpen(false)

      inputRef.current?.blur()
    }, [authScroll, inputRef])

    const handleChange = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
      setStringName(e.currentTarget.value)
    }, [])
    const handleSelectCountry = useCallback((country: ApiCountry) => {
      setIsOpen(false)
      inputRef?.current?.blur()
      setTimeout(() => {
        handleSelect(country)
        setStringName(country.name)
        /* Avoid flickering menu */
      }, TRANSITION_DURATION_ZOOM_FADE + 10)
    }, [])

    useEffect(() => {
      if (selectedCountry) {
        setStringName(selectedCountry?.name)
      }
    }, [selectedCountry])

    const renderItems = useMemo(() => {
      const some = countryList.some((country) =>
        country.name.toLowerCase().includes(stringName.toLowerCase())
      )

      if (!some) {
        return <MenuItem className="no-results">Country not found</MenuItem>
      }
      return countryList.map((country) => (
        <MenuItem
          key={country.code}
          onClick={() => {
            handleSelectCountry(country)
          }}
          hidden={
            selectedCountry?.name !== stringName &&
            !country.name.toLowerCase().includes(stringName.toLowerCase())
          }
        >
          <span class="country-emoji">{/* parseEmoji(country.emoji) */ country.emoji}</span>
          <span class="country-name">{country.name}</span>
          <span class="country-code">{country.dial_code}</span>
        </MenuItem>
      ))
    }, [selectedCountry, countryList, stringName])

    const containerRef = useRef<HTMLDivElement>(null)
    return (
      <>
        <div class="select-container" ref={containerRef}>
          <InputText
            aria-label="Select country"
            id="select-country"
            elRef={inputRef}
            onFocus={handleOnFocus}
            onInput={handleChange}
            value={stringName}
            label={t('Country')}
            loading={loading}
            endIcon={<Icon name="chevronDown" color="secondary" />}
          />
          <Menu
            transform="top"
            containerRef={containerRef}
            withBackdrop={false}
            isOpen={isOpen}
            withMount
            onClose={handleOnBlur}
          >
            {renderItems}
          </Menu>
        </div>
      </>
    )
  }
)
