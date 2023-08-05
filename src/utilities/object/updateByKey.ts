import type {RevertDeepSignal} from 'deepsignal'

export function updateByKey<T extends object>(
  target: T,
  source: Partial<RevertDeepSignal<T>>
) {
  // for (const key in source) {
  //   // @ts-expect-error Idk how to fix it????
  //   target[key] = source[key]
  //   // }
  // }

  Object.keys(source).forEach((key) => {
    // @ts-expect-error Idk how to fix it????
    target[key] = source[key]
  })
}

export function addByKey<T extends object>(
  target: T,
  source: Partial<RevertDeepSignal<T>>
) {
  Object.keys(source).forEach((key) => {
    // @ts-expect-error Idk how to fix it????
    if (!target[key]) target[key] = source[key]
  })
}
