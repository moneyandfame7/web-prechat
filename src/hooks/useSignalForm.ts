import {useComputed, useSignal} from '@preact/signals'
import {useCallback} from 'preact/compat'

export function useSignalForm() {
  const value = useSignal('')
  const error = useSignal<string | undefined>(undefined)
  const isDisabled = useComputed(() => value.value.length === 0)

  const handleChange = useCallback((v: string) => {
    if (error.value) {
      error.value = undefined
    }
    value.value = v
  }, [])

  const clearForm = useCallback(() => {
    value.value = ''
    error.value = undefined
  }, [])

  return [value, handleChange, error, isDisabled, clearForm] as const
}
