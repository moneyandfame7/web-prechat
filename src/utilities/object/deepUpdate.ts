import type {AnyObject, DeepPartial} from 'types/common'
import {isObject} from './isObject'

export function deepUpdate<T extends AnyObject>(target: T, source: DeepPartial<T>): T {
  for (const key in source) {
    // Якщо init value в стейті не буде визначенно якесь поле, то тут не пройде оновлення, тому, або робити типізацію number | undefined, instead of ?:number, або одразу задавати значення за замовченням, хоча це наврядчи.

    /* if (key in target) {  !!!! ВАЖЛИВО, МОЖЛИВО НЕ ВАРТО КОМЕНТУВАТИ ЦЕ*/
    const targetValue = target[key]
    const sourceValue = source[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // @ts-expect-error /////
      target[key] = [...sourceValue]
    } else if (
      isObject(targetValue) &&
      isObject(sourceValue) &&
      Object.keys(sourceValue).length > 0 // ??
    ) {
      deepUpdate(targetValue, sourceValue as any)
    } else {
      // @ts-expect-error /////
      target[key] = sourceValue
    }
    /* } */
  }

  return target
}
