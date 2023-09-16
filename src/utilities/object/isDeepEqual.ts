import type {AnyObject} from 'types/common'

export function isDeepEqual<T = any>(value1: T, value2: T): boolean {
  const type1 = typeof value1
  const type2 = typeof value2
  if (type1 !== type2) {
    return false
  }

  if (type1 !== 'object') {
    return value1 === value2
  }

  const isArray1 = Array.isArray(value1)
  const isArray2 = Array.isArray(value2)

  if (isArray1 !== isArray2) {
    return false
  }

  if (isArray1) {
    const array1 = value1 as any[]
    const array2 = value2 as any[]

    if (array1.length !== array2.length) {
      return false
    }

    return array1.every((member1, i) => isDeepEqual(member1, array2[i]))
  }

  const object1 = value1 as AnyObject
  const object2 = value2 as AnyObject
  const keys1 = Object.keys(object1)

  return (
    keys1.length === Object.keys(object2).length &&
    keys1.every((key1) => isDeepEqual(object1[key1], object2[key1]))
  )
}
