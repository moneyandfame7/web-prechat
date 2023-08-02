/**
 * This is a  utilities for omit "__typename" from apollo query response.
 */
export function cleanTypename<T>(response: T): T {
  return JSON.parse(
    JSON.stringify(response, (name, val) => {
      if (name === '__typename') {
        return undefined
      } else {
        return val
      }
    })
  )
}
