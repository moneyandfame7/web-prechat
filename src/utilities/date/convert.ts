export function formatDate(date: Date, is24Hour: boolean, isFull = false): string {
  const now = new Date() // Поточна дата
  console.log('ALLALALALLALFORMAT')
  // Опції для форматування дня тижня
  const weekdayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // Скорочена назва дня
  }

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  if (isFull) {
    const todayOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
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

    // Перевірка, чи цей тиждень
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
