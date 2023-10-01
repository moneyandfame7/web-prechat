import {type FC, memo, useLayoutEffect, useMemo, useState} from 'preact/compat'

import clsx from 'clsx'
import {useRef} from 'react'

import {useEventListener} from 'hooks/useEventListener'

import {
  type FullDate,
  daysOfTheWeek,
  getCurrentMothDays,
  getDaysAmountInAMonth,
  getNextMonthDays,
  getPreviousMonthDays,
  isCellInRange,
  isInRange,
  isTheSameMonth,
  isToday,
  months,
} from 'utilities/date/calendar'
import {formatDate} from 'utilities/date/convert'
import {getNow} from 'utilities/date/now'

import {TimePicker} from 'components/common/TimePicker'
import {Transition} from 'components/transitions'
import {Button, IconButton} from 'components/ui'

import {Modal, ModalActions, ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

import './CalendarModal.scss'

/**
 * @todo
 * refactor styles - [+]
 * add navigation by arrow - if up - -7 day, if left - -1d, if right - +1d, if down - +7d - [-]
 * slide transition - [+]
 * Rewrite to signals
 * check preact css transition, and css transition switch, etc
 */
export interface CalendarModalProps {
  /* Calendar props */
  min?: Date
  max?: Date
  initial?: Date
  withTime?: boolean
  onlyPast?: boolean
  onlyFuture?: boolean
  onSubmit: (date: Date) => void

  /* Modal props */
  isOpen: boolean
  onClose: VoidFunction
}
const CalendarModal: FC<CalendarModalProps> = ({
  min,
  max,
  initial,
  withTime,
  isOpen,
  onSubmit,
  onClose,
  onlyFuture,
  onlyPast,
}) => {
  useLayoutEffect(() => {
    if (!initial) {
      return
    }

    setPanelMonth(initial.getMonth())
    setPanelYear(initial.getFullYear())
  }, [initial])
  useEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()

        handleSelectPrevMonth()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()

        handleSelectNextMonth()
      }
      return
    }
    switch (e.key) {
      case 'ArrowLeft': {
        /* Handle select prev day */
        const newDate = selectedDate.getDate() - 1

        handleSelectDate({year, month, date: newDate})
        break
      }
      case 'ArrowRight': {
        const newDate = selectedDate.getDate() + 1

        handleSelectDate({year, month, date: newDate})
        /* Handle select next day */
        break
      }
      /**
       * I don't want to spend time to solving problem
       */
      /*       case 'ArrowDown': {
        const newDate = selectedDate.getDate() + 7

        handleSelectDate({year, month, date: newDate})

        break
      }
      case 'ArrowUp': {
        const newDate = selectedDate.getDate() - 7
        console.log({newDate})
        handleSelectDate({year, month, date: newDate})
        break
      } */
    }
  })

  const isNext = useRef(false)

  const now = useMemo(getNow, [])
  const initialDate = useMemo(() => initial || new Date(), [initial])

  const [selectedDate, setSelectedDate] = useState(() => initialDate)
  const [panelYear, setPanelYear] = useState(() => selectedDate.getFullYear())
  const [panelMonth, setPanelMonth] = useState(() => selectedDate.getMonth())

  const [year, month, day] = useMemo(() => {
    const currentYear = selectedDate.getFullYear()
    const currentDay = selectedDate.getDate()
    const currentMonth = selectedDate.getMonth()

    return [currentYear, currentMonth, currentDay]
  }, [selectedDate])

  const dateCells = useMemo(() => {
    const daysInAMonth = getDaysAmountInAMonth(panelYear, panelMonth)

    const currentMonthDays = getCurrentMothDays(panelYear, panelMonth, daysInAMonth)
    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth)
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth)

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }, [panelYear, panelMonth])

  const handleSelectDate = (cell: FullDate) => {
    const inRange = isCellInRange({
      onlyFuture,
      onlyPast,
      cell,
      min,
      max,
      initial: initialDate,
    })
    if (!inRange) {
      return
    }
    const {year, month, date} = cell
    if (month > panelMonth) {
      isNext.current = true
    } else if (month < panelMonth) {
      isNext.current = false
    }

    const onSelectNow = getNow()

    const newSelectedDate = new Date(
      year,
      month,
      date,
      onSelectNow.getHours(),
      onSelectNow.getMinutes(),
      onSelectNow.getSeconds()
    )
    // console.log(months[panelMonth], months[newSelectedDate.getMonth()])

    onSubmit(newSelectedDate)
    setPanelMonth(month)
    setPanelYear(year)

    setSelectedDate(newSelectedDate)
  }

  const handleSelectNextMonth = () => {
    if (!canSelectNextMonth) {
      return
    }
    isNext.current = true

    if (panelMonth === 11) {
      setPanelMonth(0)
      setPanelYear(panelYear + 1)
    } else {
      setPanelMonth(panelMonth + 1)
    }
  }
  const handleSelectPrevMonth = () => {
    if (!canSelectPrevMonth) {
      return
    }
    isNext.current = false

    if (panelMonth === 0) {
      setPanelMonth(11)
      setPanelYear(panelYear - 1)
    } else {
      setPanelMonth(panelMonth - 1)
    }
  }

  /* винести в хук? */
  const canSelectPrevMonth = onlyFuture
    ? isInRange(new Date(panelYear, panelMonth - 1, initialDate.getDate()), initialDate)
    : isInRange(new Date(panelYear, panelMonth), min, max)
  const canSelectNextMonth = onlyPast
    ? isInRange(new Date(panelYear, panelMonth + 1 /* , day */), undefined, initialDate)
    : max
    ? !isTheSameMonth(new Date(panelYear, panelMonth), max)
    : true

  const formattedSelectedDate = useMemo(
    () => formatDate(selectedDate, true, true),
    [selectedDate]
  )
  return (
    <Modal
      className="calendar-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc
      shouldCloseOnBackdrop
    >
      <ModalHeader hasCloseButton>
        <ModalTitle>
          <Transition
            activeKey={panelMonth}
            containerClassname="calendar-month"
            innerClassnames="calendar-month__inner"
            name="slideFade"
            direction={isNext.current ? 1 : -1}
          >
            {months[panelMonth]} {panelYear}
          </Transition>
        </ModalTitle>
        <div className="calendar-button calendar-button--left">
          <IconButton
            isDisabled={!canSelectPrevMonth}
            icon="previous"
            color="primary"
            onClick={handleSelectPrevMonth}
          />
        </div>
        <div className="calendar-button calendar-button--right">
          <IconButton
            isDisabled={!canSelectNextMonth}
            icon="next"
            color="primary"
            onClick={handleSelectNextMonth}
          />
        </div>
      </ModalHeader>
      <ModalContent>
        <div class="calendar-weekdays">
          {daysOfTheWeek.map((weekDay) => (
            <div key={weekDay} className="calendar-weekday">
              {weekDay}
            </div>
          ))}
        </div>
        <Transition
          activeKey={panelMonth}
          name="slide"
          shouldLockUI
          direction={isNext.current ? 1 : -1}
          containerClassname="calendar-wrapper"
          innerClassnames="calendar-grid"
        >
          {dateCells.map((cell) => {
            const isSelectedDate =
              cell.year === year && cell.month === month && cell.date === day
            const isTodayDate = isToday(cell, now)
            const isNotCurrent = cell.type !== 'current'

            const inRange = isCellInRange({
              onlyFuture,
              onlyPast,
              cell,
              min,
              max,
              initial: initialDate,
            })
            return (
              <div
                className={clsx(
                  'calendar-item',
                  isSelectedDate && 'calendar-item--selected',
                  isTodayDate && 'calendar-item--today',
                  isNotCurrent && 'calendar-item--not-current',
                  !inRange && 'calendar-item--not-in-range',
                  {}
                )}
                key={`${cell.date}-${cell.month}-${cell.year}`}
                onClick={() => inRange && handleSelectDate(cell)}
              >
                <div className="calendar-item__date">{cell.date}</div>
              </div>
            )
          })}
        </Transition>
        {withTime && (
          <TimePicker
            onChange={(t) => {
              setSelectedDate(t)
            }}
            date={selectedDate}
          />
        )}
      </ModalContent>
      <ModalActions>
        <Button>Jump to date - {formattedSelectedDate}</Button>
      </ModalActions>
    </Modal>
  )
}

export default memo(CalendarModal)
