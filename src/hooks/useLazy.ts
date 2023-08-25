import {type FC, useEffect} from 'preact/compat'

import {useForceUpdate} from './useForceUpdate'

const MEMORY_COMPONENTS: Partial<Record<string, FC>> = {}

export function useLazyComponent(componentName: string, noLoad = false) {
  const component = MEMORY_COMPONENTS[componentName]
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    // або переробити, щоб передавати сам loader ( import .///..... ), а тут вже обробляти проміс
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
