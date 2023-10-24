import type {ApiLangCode} from 'api/types'

import {TEST_translate} from 'lib/i18n'

export function formatDate(
  date: Date,
  is24Hour: boolean,
  isFull = false,
  withSeconds = false,
  withToday = true,
  language: ApiLangCode = 'en'
): string {
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
      second: withSeconds ? 'numeric' : undefined,
      hour12: !is24Hour,
      localeMatcher: 'best fit',
    }
    if (isToday && withToday) {
      return `${TEST_translate('Today')} — ${new Intl.DateTimeFormat(
        language,
        todayOptions
      ).format(date)}`
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...todayOptions,
    }

    return new Intl.DateTimeFormat(language, options).format(date)
  }

  // Перевірка, чи дата сьогодні
  if (isToday) {
    // Якщо сьогодні, форматуємо час
    return is24Hour
      ? date.toLocaleTimeString(language, {hour12: false, timeStyle: 'short'})
      : date.toLocaleTimeString(language, {hour12: true, timeStyle: 'short'})

    // Перевірка, чи цей тиждень // але ж тут перевіряю лише рік? перевіри потім ще раз
  } else if (date.getFullYear() === now.getFullYear()) {
    // Якщо цей тиждень, форматуємо день тижня
    return new Intl.DateTimeFormat(language, weekdayOptions).format(date)

    // Інакше форматуємо повну дату
  }
  return date.toLocaleDateString(language)
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

export function formatMessageGroupDate(date: Date, lang: ApiLangCode) {
  const today = new Date()

  if (sameDay(date, today)) {
    return TEST_translate('Today')
  } else if (sameYear(date, today)) {
    return date.toLocaleDateString(lang, {
      month: 'long',
      day: 'numeric',
    })
  }
  return date.toLocaleDateString(lang, {
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
