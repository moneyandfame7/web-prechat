/* 
 Taken from
https://github.com/Ajaxy/telegram-tt/blob/eccf73cbddec57759481aedd8a376266b5638943/src/api/gramjs/provider.ts#L49
*/
import * as methods from './methods'

export type Methods = typeof methods
export type MethodsArgs<T extends keyof Methods> = Parameters<Methods[T]>
export type MethodResponse<T extends keyof Methods> = ReturnType<Methods[T]>

/**
 *
 * @param name - The name of the method to be called.
 * @param args - Arguments bound by method name.
 */
export function callApi<T extends keyof Methods>(
  name: T,
  ...args: MethodsArgs<T>
): MethodResponse<T> {
  try {
    console.log({args})
    // @ts-expect-error /** Idk why it not work */
    return methods[name](...args) as MethodResponse<T>
  } catch (e) {
    if (e instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('[API]', e.message)
    }
  }

  throw new Error(`Method «[${name}]» execution failed`)
}
