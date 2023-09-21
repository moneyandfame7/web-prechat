/**
 *
 * @returns Exception key for transition.
 * Залишає в exception ПОПЕРЕДНІ відкриті чати.
 * Якщо відкриваємо openPreviousChat() - минулий чат зникає з exception.
 */
export function getCleanupExceptionKey(active: number, prev?: number) {
  return prev !== undefined && prev < active ? prev : undefined
}
