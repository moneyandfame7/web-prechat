const patterns = {
  '+380': '‒‒ ‒‒‒ ‒‒ ‒‒'
}
type FormattedPhone =
  | {
      formatted: string
      remainingPattern?: undefined
      formattedWithPattern?: undefined
    }
  | {
      formatted: string
      remainingPattern: string
      formattedWithPattern?: undefined
    }
  | {
      formatted: string
      remainingPattern: string
      formattedWithPattern: string
    }

type CodePatterns = keyof typeof patterns
/**
 * @example formatPhoneNumber("+38096281", "+380")
 *
 *  = {
 *   formatted: "+380 96 281",
 *   remainingPattern: "## ##",
 *   formattedWithPattern: "+380 96 281 ## ##"
 * }
 */
export const formatPhoneNumber = (phone?: string, code?: string): FormattedPhone => {
  if (!phone) {
    return {formatted: ''}
  }
  if (!code || phone.length === 0) {
    return {formatted: phone}
  }

  let pattern = patterns[code as CodePatterns]
  const testPhone = phone.trim().split(code)[1]

  if (!pattern) {
    pattern = patterns['+380']
  }
  if (!testPhone) {
    if (phone.trim() === code) {
      return {formatted: phone + ' ', remainingPattern: pattern}
    }
    return {formatted: phone}
  }

  const digitRegex = /\d/
  let digitIndex = 0

  const formattedPhoneNumber = pattern.replace(/‒/g, () => {
    const digit = testPhone[digitIndex]
    digitIndex++

    return digitRegex.test(digit) ? digit : '‒' // Замінити символ "-" на цифру або зберегти "-", якщо цифра відсутня
  })
  const formattedWithPattern = code + ' ' + formattedPhoneNumber
  const formatted = formattedWithPattern.replace(/‒+.*$/, '')
  const remainingPattern = formattedPhoneNumber.replace(/\d+/g, '')

  return {formatted, formattedWithPattern, remainingPattern}
}
