interface MsInput {
  seconds?: number
  days?: number
  hours?: number
  minutes?: number
  months?: number
  weeks?: number
}
/**
 * @param value - object {@link MsInput}
 */
export const milliseconds = (value: MsInput) => {
  let totalMs = 0

  if (value.months) {
    // Враховуємо приблизну кількість мілісекунд в місяці (приблизно 30.44 днів в місяці)
    totalMs += value.months * 30.44 * 24 * 60 * 60 * 1000
  }

  if (value.weeks) {
    totalMs += value.weeks * 7 * 24 * 60 * 60 * 1000 // 7 днів в одному тижні
  }

  if (value.days) {
    totalMs += value.days * 24 * 60 * 60 * 1000
  }

  if (value.hours) {
    totalMs += value.hours * 60 * 60 * 1000
  }

  if (value.minutes) {
    totalMs += value.minutes * 60 * 1000
  }

  if (value.seconds) {
    totalMs += value.seconds * 1000
  }

  return totalMs
}
