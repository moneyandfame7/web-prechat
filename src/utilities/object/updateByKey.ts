import type {RevertDeepSignal} from 'deepsignal'

import {deepCopy} from './deepCopy'

export function updateByKey<T extends object>(
  target: T,
  source: Partial<RevertDeepSignal<T>>
) {
  // for (const key in source) {
  //   // @ts-expect-error Idk how to fix it????
  //   target[key] = source[key]
  //   // }
  // }
  /**
   * @todo подивитись проблему в цьому? чи допоможе просто спред оператор?
   */
  Object.keys(source).forEach((key) => {
    // @ts-expect-error Idk how to fix it????
    target[key] = deepCopy(source[key])
  })
}

export function addByKey<T extends object>(target: T, source: Partial<RevertDeepSignal<T>>) {
  Object.keys(source).forEach((key) => {
    // @ts-expect-error Idk how to fix it????
    if (!target[key]) target[key] = source[key]
  })
}

export function deleteByKey<T extends object>(target: T) {
  Object.keys(target).forEach((key) => {
    // if (target[key as keyof T]) {
    delete target[key as keyof T]
    // }
  })
}
