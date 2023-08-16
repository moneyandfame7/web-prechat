import {deepClone} from 'utilities/object/deepClone'
import type {Key} from 'types/ui'

export type BuildedRecord<T> = Record<Key, T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildRecord<T extends Record<string, any>>(array: T[], key: keyof T) {
  return array.reduce((record: BuildedRecord<T>, val: T) => {
    record[val[key]] = deepClone(val)

    return record
  }, {})
}
