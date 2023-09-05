import {useCallback, useMemo, useState} from 'preact/hooks'

import clsx from 'clsx'

import {
  type DateCellItem,
  daysOfTheWeek,
  getCurrentMothDays,
  getDaysAmountInAMonth,
  getNextMonthDays,
  getPreviousMonthDays,
  isInRange,
  isToday,
  months,
} from 'utilities/date/calendar'

import {TimePicker} from './TimePicker'

import './DatePicker.scss'

interface DatePickerPopupContentProps {
  selectedValue: Date
  inputValueDate?: Date
  min?: Date
  max?: Date
  onChange: (value: Date) => void
}

export const DatePickerPopupContent = ({
  selectedValue,
  inputValueDate,
  onChange,
  min,
  max,
}: DatePickerPopupContentProps) => {
  const [panelYear, setPanelYear] = useState(() => selectedValue.getFullYear())
  const [panelMonth, setPanelMonth] = useState(() => selectedValue.getMonth())
  const todayDate = useMemo(() => new Date(), [])

  const [year, month, day] = useMemo(() => {
    const currentYear = selectedValue.getFullYear()
    const currentDay = selectedValue.getDate()
    const currentMonth = selectedValue.getMonth()

    return [currentYear, currentMonth, currentDay]
  }, [selectedValue])

  const dateCells = useMemo(() => {
    const daysInAMonth = getDaysAmountInAMonth(panelYear, panelMonth)

    const currentMonthDays = getCurrentMothDays(panelYear, panelMonth, daysInAMonth)
    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth)
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth)

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }, [panelYear, panelMonth])

  const onDateSelect = useCallback((item: DateCellItem) => {
    onChange(new Date(item.year, item.month, item.date))
  }, [])

  const nextMonth = () => {
    if (panelMonth === 11) {
      setPanelMonth(0)
      setPanelYear(panelYear + 1)
    } else {
      setPanelMonth(panelMonth + 1)
    }
  }

  const canUsePrevMonth = useMemo(
    () => isInRange(new Date(panelYear, panelMonth - 1, day), min, max),
    [panelYear, panelMonth, day, max, min]
  )

  const canUseNextMonth = useMemo(
    () => isInRange(new Date(panelYear, panelMonth + 1, day), min, max),
    [panelMonth, day, min, max]
  )

  const prevMonth = () => {
    if (panelMonth === 0) {
      setPanelMonth(11)
      setPanelYear(panelYear - 1)
    } else {
      setPanelMonth(panelMonth - 1)
    }
  }

  return (
    <div className="CalendarPanel">
      <div className="CalendarPanel__header">
        <div className="CalendarPanel__date" data-testid="date-picker-popup-month">
          {months[panelMonth]} {panelYear}
        </div>
        <div className="CalendarPanel__buttons">
          <div className="CalendarPanel__buttons-left">
            <button
              data-testid="date-picker-popup-prev-month"
              onClick={prevMonth}
              disabled={!canUsePrevMonth}
            >
              Prev Month
            </button>
          </div>
          <div className="CalendarPanel__buttons-right">
            <button
              data-testid="date-picker-popup-next-month"
              onClick={nextMonth}
              disabled={!canUseNextMonth}
            >
              Next Month
            </button>
          </div>
        </div>
      </div>
      <div className="CalendarPanel__content">
        {daysOfTheWeek.map((weekDay) => (
          <div key={weekDay} className="CalendarPanelItem">
            {weekDay}
          </div>
        ))}
        {dateCells.map((cell) => {
          const isSelectedDate =
            cell.year === year && cell.month === month && cell.date === day
          const isTodayDate = isToday(cell, todayDate)
          const isNotCurrent = cell.type !== 'current'
          const isDateInRange = isInRange(new Date(cell.year, cell.month, cell.date), min, max)
          return (
            <div
              className={clsx(
                'CalendarPanelItem',
                isSelectedDate && 'CalendarPanelItem--selected',
                isTodayDate && 'CalendarPanelItem--today',
                isNotCurrent && 'CalendarPanelItem--not-current',
                !isDateInRange && 'CalendarPanelItem--not-in-range',
                {}
              )}
              key={`${cell.date}-${cell.month}-${cell.year}`}
              onClick={() => isDateInRange && onDateSelect(cell)}
              data-testid="date-picker-popup-cell"
            >
              <div className="CalendarPanelItem__date">{cell.date}</div>
            </div>
          )
        })}
      </div>
      <div className="CalendarPanel__time-picker">
        Lol kek
        <TimePicker />
      </div>
    </div>
  )
}
