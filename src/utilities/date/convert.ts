export function formatDate(date: Date, is24Hour: boolean, isFull = false): string {
  const now = new Date() // Поточна дата
  // console.log('FORMAT_DATE')
  // Опції для форматування дня тижня
  const weekdayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // Скорочена назва дня
  }

  const isToday = sameDay(date, now)
  if (isFull) {
    const todayOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
      hour12: !is24Hour,
      localeMatcher: 'best fit',
    }
    if (isToday) {
      return `Today — ${new Intl.DateTimeFormat('uk', todayOptions).format(date)}`
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...todayOptions,
    }

    return new Intl.DateTimeFormat('uk', options).format(date)
  }

  // Перевірка, чи дата сьогодні
  if (isToday) {
    // Якщо сьогодні, форматуємо час
    return is24Hour
      ? date.toLocaleTimeString('en', {hour12: false, timeStyle: 'short'})
      : date.toLocaleTimeString('en', {hour12: true, timeStyle: 'short'})

    // Перевірка, чи цей тиждень // але ж тут перевіряю лише рік? перевіри потім ще раз
  } else if (date.getFullYear() === now.getFullYear()) {
    // Якщо цей тиждень, форматуємо день тижня
    return new Intl.DateTimeFormat('en', weekdayOptions).format(date)

    // Інакше форматуємо повну дату
  }
  return date.toLocaleDateString('en')
}

export function formatTime(hour: string, minute: string, is12HourFormat: boolean) {
  let formattedHour = hour
  let amPm = ''

  if (is12HourFormat) {
    const intHour = parseInt(hour)
    if (intHour >= 12) {
      amPm = ' PM'
      if (intHour > 12) {
        formattedHour = (intHour - 12).toString().padStart(2, '0')
      }
    } else {
      amPm = ' AM'
      if (intHour === 0) {
        formattedHour = '12'
      }
    }
  }

  return `${formattedHour}:${minute}${amPm}`
}

/* Need to pass locale? */
export function formatMessageTime(date: Date, hour12 = false) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12,
  })
}

export function formatMessageGroupDate(date: Date, locale?: Intl.LocalesArgument) {
  const today = new Date()

  if (sameDay(date, today)) {
    return 'Today'
  } else if (sameYear(date, today)) {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })
  }
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Check if two dates are the same day
function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

// Check if two dates are in the same year
function sameYear(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear()
}
