import { FC, RefObject, TargetedEvent, useCallback } from 'preact/compat'

import { InputText } from 'components/Input'
import { t } from 'lib/i18n'

interface PhoneNumberInputProps {
  onInput: (phone: string) => void
  value: string
  elRef: RefObject<HTMLInputElement>
  autoFocus?: boolean
}
// const pattern = /^\+\d+$/
export const PhoneNumberInput: FC<PhoneNumberInputProps> = ({
  elRef,
  onInput,
  value,
  autoFocus = true
}) => {
  const handleKeydown = useCallback((e: TargetedEvent<HTMLInputElement, KeyboardEvent>) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }, [])
  const handleInput = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      // const formattedNumber = e.currentTarget.value.replace(
      //   /^\+?(\d{1,3})?(\d{2})?(\d{3})?(\d{2})?(\d+)?(.*)?$/,
      //   (match, p1, p2, p3, p4, p5, p6) => {
      //     const groups = [p1, p2, p3, p4]
      //     if (p5) {
      //       groups.push(p5.replace(/(\d{2})(\d+)/, '$1 $2'))
      //     }
      //     if (p6) {
      //       groups.push(p6)
      //     }
      //     return groups.filter(Boolean).join(' ')
      //   }
      // )

      onInput(e.currentTarget.value)
    },
    [onInput]
  )

  return (
    <InputText
      autoFocus={autoFocus}
      elRef={elRef}
      label={t('PhoneNumber')}
      value={value}
      onInput={handleInput}
      onKeyDown={handleKeydown}
    />
  )
}
