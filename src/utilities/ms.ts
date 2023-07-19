interface MsInput {
  days?: number
  hours?: number
  minutes?: number
}
/**
 * @param value - object {@link MsInput}
 */
export const milliseconds = (value: MsInput) => {
  let totalMs = 0

  if (value.days) {
    totalMs += value.days * 24 * 60 * 60 * 1000
  }

  if (value.hours) {
    totalMs += value.hours * 60 * 60 * 1000
  }

  if (value.minutes) {
    totalMs += value.minutes * 60 * 1000
  }

  return totalMs
}
