export const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const WEEKDAYS_LANG = [
  'Date.DayOfWeek_1',
  'Date.DayOfWeek_2',
  'Date.DayOfWeek_3',
  'Date.DayOfWeek_4',
  'Date.DayOfWeek_5',
  'Date.DayOfWeek_6',
  'Date.DayOfWeek_7',
]
// export const MONTH_LANG = [
//   'Date.Month_1',
//   'Date.Month_2',
//   'Date.Month_3',
//   'Date.Month_4',
//   'Date.Month_5',
//   'Date.Month_6',
//   'Date.Month_7',
//   'Date.Month_8',
//   'Date.Month_9',
//   'Date.Month_10',
//   'Date.Month_11',
//   'Date.Month_12',
// ]
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const VISIBLE_CELLS_AMOUNT = 7 * 6
const sundayWeekToMondayWeekDayMap: Record<number, number> = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
}

export interface DateCellItem {
  date: number
  month: number
  year: number
  type: 'next' | 'prev' | 'current'
}

export const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1)
  // mutates the date object
  nextMonthDate.setMinutes(-1)
  return nextMonthDate.getDate()
}

const getDayOfTheWeek = (date: Date) => {
  const day = date.getDay()

  return sundayWeekToMondayWeekDayMap[day]
}

export const getPreviousMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1)
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay)

  const daysAmountInPrevMonth = getDaysAmountInAMonth(year, month - 1)

  const dateCells: DateCellItem[] = []

  const [cellYear, cellMonth] = month === 0 ? [year - 1, 11] : [year, month - 1]

  for (let i = prevMonthCellsAmount - 1; i >= 0; i--) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: daysAmountInPrevMonth - i,
      type: 'prev',
    })
  }

  return dateCells
}

export const getNextMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1)
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay)

  const daysAmount = getDaysAmountInAMonth(year, month)

  const nextMonthDays = VISIBLE_CELLS_AMOUNT - daysAmount - prevMonthCellsAmount

  const [cellYear, cellMonth] = month === 11 ? [year + 1, 0] : [year, month + 1]

  const dateCells: DateCellItem[] = []

  for (let i = 1; i <= nextMonthDays; i++) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: i,
      type: 'next',
    })
  }

  return dateCells
}

export const getCurrentMothDays = (year: number, month: number, numberOfDays: number) => {
  const dateCells: DateCellItem[] = []

  for (let i = 1; i <= numberOfDays; i++) {
    dateCells.push({
      year,
      month,
      date: i,
      type: 'current',
    })
  }

  return dateCells
}

const addLeadingZeroIfNeeded = (value: number) => {
  if (value > 9) {
    return value.toString()
  }

  return `0${value}`
}

export const getInputValueFromDate = (value: Date) => {
  const date = addLeadingZeroIfNeeded(value.getDate())
  const month = addLeadingZeroIfNeeded(value.getMonth() + 1)
  const year = value.getFullYear()

  return `${date}-${month}-${year}`
}

export const getDateFromInputValue = (inputValue: string) => {
  if (!isValidDateString(inputValue)) {
    return
  }

  const [date, month, year] = inputValue.split('-').map((v) => parseInt(v))

  const dateObj = new Date(year, month - 1, date)

  return dateObj
}

const validValueRegex = /^\d{2}-\d{2}-\d{4}$/

export const isValidDateString = (value: string) => {
  if (!validValueRegex.test(value)) {
    return false
  }
  const [date, month, year] = value.split('-').map((v) => parseInt(v))

  if (month < 1 || month > 12 || date < 1) {
    return false
  }

  const maxDaysInAMonth = getDaysAmountInAMonth(year, month - 1)

  if (date > maxDaysInAMonth) {
    return false
  }

  return true
}

export function isToday(cell: DateCellItem, todayDate: Date) {
  return (
    todayDate.getFullYear() === cell.year &&
    todayDate.getMonth() === cell.month &&
    todayDate.getDate() === cell.date
  )
}

export function isInRange(value: Date, min?: Date, max?: Date) {
  if (min && max) {
    return isSmallerThanDate(value, max) && isBiggerThanDate(value, min)
  }

  if (min) {
    return isBiggerThanDate(value, min)
  }

  if (max) {
    return isSmallerThanDate(value, max)
  }

  return true
}

export function isTheSameMonth(value: Date, date: Date) {
  return value.getFullYear() === date.getFullYear() && value.getMonth() === date.getMonth()
}

function isBiggerThanDate(value: Date, date: Date) {
  if (value.getFullYear() > date.getFullYear()) {
    return true
  }

  if (value.getFullYear() < date.getFullYear()) {
    return false
  }

  if (value.getMonth() > date.getMonth()) {
    return true
  }

  if (value.getMonth() < date.getMonth()) {
    return false
  }

  return value.getDate() >= date.getDate()
}

function isSmallerThanDate(value: Date, date: Date) {
  if (value.getFullYear() > date.getFullYear()) {
    return false
  }

  if (value.getFullYear() < date.getFullYear()) {
    return true
  }

  if (value.getMonth() > date.getMonth()) {
    return false
  }

  if (value.getMonth() < date.getMonth()) {
    return true
  }

  return value.getDate() <= date.getDate()
}

interface IsCellInRangeOptions {
  onlyPast?: boolean
  onlyFuture?: boolean
  cell: DateCellItem
  min?: Date
  max?: Date
  initial: Date
}
export function isCellInRange({
  onlyFuture,
  onlyPast,
  cell,
  min,
  max,
  initial,
}: IsCellInRangeOptions) {
  const {year, month, date} = cell
  const cellDate = new Date(year, month, date)

  if (onlyFuture && onlyPast) {
    return isToday(cell, initial)
  }

  if (onlyFuture) {
    return isInRange(cellDate, initial) && isInRange(cellDate, min, max)
  }
  if (onlyPast) {
    return isInRange(cellDate, undefined, initial) && isInRange(cellDate, min, max)
  }

  return isInRange(cellDate, min, max)
}
