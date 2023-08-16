import {getRandom} from 'utilities/number/getRandom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function randomize<T extends Array<any>>(arr: T) {
  return arr[getRandom(0, arr.length - 1)]
}
