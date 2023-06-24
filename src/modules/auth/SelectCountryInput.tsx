import {
  FC,
  TargetedEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'preact/compat'

import type { Country } from 'types/api'

import { ClickAwayListener } from 'components/ClickAwayListener'
import { InputText } from 'components/Input'
import { MenuItem, Menu } from 'components/Menu'

import { TRANSITION_DURATION_FADE } from 'common/config'

import './SelectCountryInput.scss'

interface SelectCountryInputProps {
  countryList: Country[]
  selectedCountry?: Country
  loading: boolean
  handleSelect: (country: Country) => void
}
export const SelectCountryInput: FC<SelectCountryInputProps> = memo(
  ({ countryList, selectedCountry, loading, handleSelect }) => {
    const [isOpen, setIsOpen] = useState(false)
    const authScroll = document.getElementById('auth-scroll')
    const [stringName, setStringName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const handleOnFocus = useCallback(() => {
      if (loading) return

      setIsOpen(true)
      setTimeout(() => {
        authScroll?.scrollTo({ top: authScroll.scrollHeight, behavior: 'smooth' })
      }, 100)
    }, [countryList, selectedCountry, loading])

    const handleOnBlur = () => {
      setIsOpen(false)
      setTimeout(() => {
        authScroll?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }

    const handleChange = useCallback((e: TargetedEvent<HTMLInputElement, Event>) => {
      setStringName(e.currentTarget.value)
    }, [])

    const handleSelectCountry = useCallback((country: Country) => {
      setIsOpen(false)
      inputRef?.current?.blur()
      setTimeout(() => {
        handleSelect(country)
        setStringName(country.name)
        /* avoid flickering menu */
      }, TRANSITION_DURATION_FADE)
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
          <span class="country-emoji">{country.emoji}</span>
          <span class="country-name">{country.name}</span>
          <span class="country-code">{country.dial_code}</span>
        </MenuItem>
      ))
    }, [selectedCountry, countryList, stringName])

    return (
      <div class="select-container">
        <InputText
          elRef={inputRef}
          onFocus={handleOnFocus}
          onInput={handleChange}
          // onBlur={handleOnBlur}
          value={stringName}
          label="Country"
          loading={loading}
          withArrow
        />
        <ClickAwayListener onClickAway={handleOnBlur}>
          <Menu isOpen={isOpen} withMount={false}>
            {renderItems}
          </Menu>
        </ClickAwayListener>
      </div>
    )
  }
)
