export function isInRange(toCompare: number, value: number, range: number) {
  const minimum = value - range
  const maximum = value + range

  return toCompare >= minimum && toCompare <= maximum
}
