import {useCallback} from 'preact/compat'
import {useReducer} from 'preact/hooks'

export const useForceUpdate = () => {
  const [, updater] = useReducer((x) => !x, true)

  return useCallback(() => {
    updater('')
  }, [])
}
