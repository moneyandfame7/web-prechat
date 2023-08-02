import type {TargetedEvent} from 'preact/compat'
import {useCallback, useState} from 'preact/hooks'

import type {InputHandler} from 'types/ui'

interface UseInputValueInput {
  initial?: string
  cb?: InputHandler
}
interface UseInputValueOtput {
  value: string
  handleInput: InputHandler
}

export const useInputValue = (input: UseInputValueInput): UseInputValueOtput => {
  const {initial = '', cb} = input
  const [value, setValue] = useState(initial)

  const handleInput = useCallback(
    (e: TargetedEvent<HTMLInputElement, Event>) => {
      e.preventDefault()
      setValue(e.currentTarget.value)
      cb?.(e)
    },
    [cb]
  )

  return {
    value,
    handleInput
  }
}
