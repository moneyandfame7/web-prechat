/**
 * Reverse negative number to positive -b => b
 * @example const reversed = reverseNegativeNumber(-5) // 5
 * @returns
 */
export const reverseNegativeNumber = <T extends number>(number: T) => {
  const splitted = number.toString().split('-')
  return parseInt(splitted[1] || splitted[0])
}
