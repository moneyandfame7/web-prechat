const patterns = {
  '+380': '## ### ## ##',
  '+1': '### ### ####',
  '+44': '## #### ####',
  '+48': '## ### ## ##',
  '+81': '## #### ####'
}

export const formatPhone = (phone: string) => {
  if (phone.length < 2) {
    return {formatted: phone}
  }
  for (const code in patterns) {
    if (phone.startsWith(code)) {
      const pattern = patterns[code as keyof typeof patterns]

      const testPhone = phone.split(code)[1]

      const digitRegex = /\d/
      let digitIndex = 0
      const formattedPhoneNumber = pattern.replace(/#/g, () => {
        const digit = testPhone[digitIndex]
        digitIndex++

        return digitRegex.test(digit) ? digit : '#' // Замінити символ "#" на цифру або зберегти "-", якщо цифра відсутня
      })

      const formattedWithPattern = code + ' ' + formattedPhoneNumber
      const formatted = formattedWithPattern.replace(/#+.*$/, '')
      /* .trim(); */ /* replace(/\s+$/, ''); */
      const remainingPattern = formattedPhoneNumber
        .replace(/\d+/g, '')
        .trim() /* replace(/^\s+/, '') */

      return {formatted, formattedWithPattern, remainingPattern}
    }
  }

  return {formatted: phone}
}
