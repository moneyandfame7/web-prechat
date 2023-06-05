import { useCallback, useState } from 'preact/hooks'

type HookFlag = (initial?: boolean) => [boolean, VoidFunction, VoidFunction]

export const useFlag: HookFlag = (initial = false) => {
  const [state, setState] = useState(initial)

  const setTrue = useCallback(() => {
    setState(true)
  }, [])

  const setFalse = useCallback(() => {
    setState(false)
  }, [])
  return [state, setTrue, setFalse]
}
