/* eslint-disable @typescript-eslint/consistent-type-imports */
import {useEffect} from 'preact/hooks'
import {DEBUG} from 'common/config'

import {useForceUpdate} from './useForceUpdate'

export enum Modules {
  Auth = 'auth',
  Main = 'main',
  Common = 'common'
}

interface LazyModules {
  [Modules.Auth]: typeof import('../lazy/auth')
  [Modules.Main]: typeof import('../lazy/main')
  [Modules.Common]: typeof import('../lazy/common')
}

type LazyComponentName<T extends Modules> = keyof LazyModules[T]

type LazyComponentType<
  M extends Modules,
  N extends LazyComponentName<M>
> = LazyModules[M][N]

type ModulePromise = {
  [K in keyof LazyModules]: Promise<LazyModules[K]>
}
const MEMORY_CACHE: Partial<LazyModules> = {}
const LOAD_PROMISES: Partial<ModulePromise> = {}
function loadFromMemory<M extends Modules, N extends LazyComponentName<M>>(
  moduleName: M,
  component: N
) {
  const module = MEMORY_CACHE[moduleName] as LazyModules[M]

  return module?.[component] as LazyComponentType<M, N>
}

async function loadComponent<M extends Modules>(moduleName: M) {
  if (!LOAD_PROMISES[moduleName]) {
    switch (moduleName) {
      case Modules.Auth:
        LOAD_PROMISES[Modules.Auth] = import('../lazy/auth')
        break
      case Modules.Main:
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.log('>>> START LOAD MAIN BUNDLE')
        }

        LOAD_PROMISES[Modules.Main] = import('../lazy/main')
        break
      case Modules.Common:
        LOAD_PROMISES[Modules.Common] = import('../lazy/common')
        break
    }
  }

  const module = (await LOAD_PROMISES[moduleName]) as unknown as LazyModules[M]

  if (!MEMORY_CACHE[moduleName]) {
    MEMORY_CACHE[moduleName] = module
  }

  return module
}

export const useCachedLazy = <T extends Modules>(
  moduleName: T,
  componentName: LazyComponentName<T>,
  noLoad = false
) => {
  const component = loadFromMemory(moduleName, componentName)

  const forceUpdate = useForceUpdate()

  useEffect(() => {
    if (!noLoad && !component) {
      // const Component=
      loadComponent(moduleName).then(forceUpdate)
    }
  }, [noLoad, /*  component, */ moduleName, componentName])

  return component
}
