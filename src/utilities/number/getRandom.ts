/**
 * @param min inclusive
 * @param max inclusive
 * @returns random in range
 */
export function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
