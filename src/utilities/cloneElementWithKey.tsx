import {Fragment, cloneElement, type VNode, type Key} from 'preact'

/**
 * @param el - the component to be cloned
 * @param key - the key for component
 * @param props - additional props for component
 *
 * @returns cloned element with provided key and additional props
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cloneElementWithKey = (el: VNode, key: Key, props?: any[]) => {
  return <Fragment key={key}>{cloneElement(el, props)}</Fragment>
}
