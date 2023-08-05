import {type FC, useEffect} from 'preact/compat'
import {useForceUpdate} from './useForceUpdate'

const MEMORY_COMPONENTS: Partial<Record<string, FC>> = {}

export function useLazyComponent(componentName: string, noLoad = false) {
  const component = MEMORY_COMPONENTS[componentName]
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    if (!noLoad && !component) {
      import(`../lazy/${componentName}.tsx`)
        .then((c) => {
          MEMORY_COMPONENTS[componentName] = c[componentName]
        })
        .then(forceUpdate)
    }
  }, [componentName, noLoad])

  return component
}
