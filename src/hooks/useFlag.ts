import { StateUpdater, useCallback, useState } from 'preact/hooks'

interface UseBooleanOutput {
  value: boolean
  setValue: StateUpdater<boolean>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}
type UseBoolean = (initial?: boolean) => UseBooleanOutput
const useBoolean: UseBoolean = (initial = false) => {
  const [value, setValue] = useState(initial)

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])
  const setFalse = useCallback(() => {
    setValue(false)
  }, [])
  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return {
    value,
    setValue,
    setFalse,
    setTrue,
    toggle
  }
}

export { useBoolean }
